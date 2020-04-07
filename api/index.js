const express = require('express')
const cors = require('cors')
const elasticsearch = require('elasticsearch')
const serverless = require('serverless-http') // <- 追加

const app = express()
app.use(cors())

const INDEX = 'kunshujo_items' // process.env.ELASTIC_SEARCH_MAIN_INDEX
const IMAGES_INDEX = 'kunshujo_images'
const host =
  'https://search-nakamura196-rgvfh3jsqpal3gntof6o7f3ch4.us-east-1.es.amazonaws.com' // process.env.ELASTIC_SEARCH_HOST
const moreLikeThisFields = ['_title']

const fcs = ['機械タグ', '抽出方法'] // JSON.parse(process.env.FACETS_LABELS)

// 検索対象メタデータ
const fields = ['_title'] // JSON.parse(process.env.SEARCH_LABELS)

const client = new elasticsearch.Client({
  host,
})

require('tls').DEFAULT_MIN_VERSION = 'TLSv1'

app.get('/', (_req, res) => {
  return res.send('api index')
})

app.get('/item/:id', (_req, res) => {
  const id = _req.params.id
  client
    .get({
      index: INDEX,
      id,
    })
    .then(
      function (resp) {
        const metadata = resp._source
        metadata._id = resp._id
        return res.json(metadata)
      },
      function (err) {
        return res.json(err)
      }
    )
})

app.get('/search', (_req, res) => {
  const FC_SIZE = 50

  const from = _req.query.from ? Number(_req.query.from) : 0
  let size = _req.query.size ? Number(_req.query.size) : 20

  if (size > 500) {
    size = 500
  }

  // -------------------------

  // Aggregation

  const aggs = {}

  const fcsMap = {}
  for (let i = 0; i < fcs.length; i++) {
    const field = fcs[i]
    const fcsField = 'fc-' + field
    if (_req.query[fcsField]) {
      const value = _req.query[fcsField]
      let values = []
      if (!Array.isArray(value)) {
        values = [value]
      } else {
        values = value
      }
      fcsMap[fcsField] = values
    }

    // aggs
    aggs[field] = {
      terms: {
        field: field + '.keyword',
        size: FC_SIZE,
        order: {
          _count: 'desc',
        },
      },
    }
  }

  // クエリ本体

  const query = {
    bool: {
      must: [],
      should: [],
      filter: [],
    },
  }

  // キーワード
  const keyword = _req.query.keyword ? _req.query.keyword : []
  let keywords = []
  if (!Array.isArray(keyword)) {
    keywords = [keyword]
  } else {
    keywords = keyword
  }
  // keyword=図書館&keywordOr=true
  const keywordOr = _req.query.keywordOr === 'true'

  const kerwordPhase = []
  for (let i = 0; i < keywords.length; i++) {
    const keyword = keywords[i]

    if (keyword.startsWith('-')) {
      const mustNotPhase = []

      for (let j = 0; j < fields.length; j++) {
        const matchPhrase = {}
        matchPhrase[fields[j]] = keyword.slice(1)
        mustNotPhase.push({
          match_phrase: matchPhrase,
        })
      }

      kerwordPhase.push({
        bool: {
          must_not: mustNotPhase,
        },
      })
    } else {
      const shouldPhase = []

      for (let j = 0; j < fields.length; j++) {
        const matchPhrase = {}
        matchPhrase[fields[j]] = keyword
        shouldPhase.push({
          match_phrase: matchPhrase,
        })
      }

      kerwordPhase.push({
        bool: {
          should: shouldPhase,
        },
      })
    }
  }

  query.bool[keywordOr ? 'should' : 'must'] = kerwordPhase

  // ---------------------

  for (const field in fcsMap) {
    const shouldPhase = []
    const mustNotPhase = []

    query.bool.filter.push({
      bool: {
        must: [
          {
            bool: {
              should: shouldPhase,
              must_not: mustNotPhase,
            },
          },
        ],
      },
    })

    const values = fcsMap[field]

    for (let j = 0; j < values.length; j++) {
      const value = values[j]

      if (value.startsWith('-')) {
        const termPhase = {}
        termPhase[field.slice(3) + '.keyword'] = value.slice(1) // "fc-"の除外
        mustNotPhase.push({
          term: termPhase,
        })
      } else {
        const termPhase = {}
        termPhase[field.slice(3) + '.keyword'] = value // "fc-"の除外
        shouldPhase.push({
          term: termPhase,
        })
      }
    }
  }

  /*
  const after = _req.query.after
  if (after != null) {
    query.bool.filter.push({
      bool: {
        should: [
          {
            bool: {
              must: [
                {
                  range: {
                    after: {
                      lte: Number(after)
                    }
                  }
                },
                {
                  range: {
                    before: {
                      gte: Number(after)
                    }
                  }
                }
              ]
            }
          },
          {
            range: {
              after: {
                gte: Number(after)
              }
            }
          }
        ]
      }
    })
  }

  const before = _req.query.before
  if (before != null) {
    query.bool.filter.push({
      bool: {
        should: [
          {
            bool: {
              must: [
                {
                  range: {
                    after: {
                      lte: Number(before)
                    }
                  }
                },
                {
                  range: {
                    before: {
                      gte: Number(before)
                    }
                  }
                }
              ]
            }
          },
          {
            range: {
              before: {
                lte: Number(before)
              }
            }
          }
        ]
      }
    })
  }
  */

  // 一時的
  /*
  if (image === '') {
    query.bool.must.push({
      bool: {
        should: [
          {
            match: {
              media: {
                query: 'IIIF',
                boost: 2
              }
            }
          },
          {
            match: {
              media: {
                query: '画像あり',
                boost: 2
              }
            }
          },
          {
            match: {
              media: {
                query: '画像なし',
                boost: 1
              }
            }
          }
        ]
      }
    })
  }
  */

  // more like this
  const id = _req.query.id
  if (id) {
    let ids = []
    if (!Array.isArray(id)) {
      ids = [id]
    } else {
      ids = id
    }

    const like = []
    for (let i = 0; i < ids.length; i++) {
      like.push({
        _index: INDEX,
        _id: ids[i],
      })
    }

    query.bool.must.push({
      more_like_this: {
        fields: moreLikeThisFields,
        like,
        min_term_freq: 1,
        max_query_terms: 12,
      },
    })
  }

  // images
  const image = _req.query.image

  if (image != null) {
    client
      .get({
        index: IMAGES_INDEX,
        id: image,
      })
      .then(
        function (resp) {
          const ids = resp._source.similar_images
          if (ids) {
            similarImages(res, ids, query, aggs, size, from)
          } else {
            return res.json({})
          }
        },
        function (err) {
          return res.json({
            query,
            err,
          })
        }
      )
  } else {
    const sort = _req.query.sort ? _req.query.sort : null
    const sorts = []
    if (sort != null && !sort.includes('_score')) {
      const tmp = sort.split(':')
      const field = tmp[0] // tmp[0].includes('_') ? tmp[0] + '.keyword' : tmp[0]
      const order = tmp[1]
      const obj = {}
      obj[field] = {
        order,
      }
      sorts.push(obj)
      sorts.push('_score')
    }

    const body = {
      query,
      aggs,
      size,
      from,
      sort: sorts,
    }

    client
      .search({
        index: INDEX,
        body,
      })
      .then(
        function (resp) {
          resp.body = body
          return res.json(resp)
        },
        function (err) {
          return res.json({
            body,
            err,
          })
        }
      )
  }

  // ---------------------
})

function similarImages(res, ids, query, aggs, size, from) {
  if (ids.length > 0) {
    query.bool.must.push({
      terms: {
        _id: ids,
      },
    })
  }

  client
    .search({
      index: INDEX,
      body: {
        query,
        aggs,
        size,
        from,
      },
    })
    .then(
      function (resp) {
        const hits = resp.hits.hits

        // ID_MAPの作成
        const tmpIdMap = {}
        for (let i = 0; i < hits.length; i++) {
          const id = hits[i]._id
          tmpIdMap[id] = hits[i]
        }

        // 元のID順（スコア順）に並び替え
        const sortedHits = []
        for (let i = 0; i < ids.length; i++) {
          const obj = tmpIdMap[ids[i]]
          if (obj != null) {
            // && sortedHits.length < sizeShowMax) {
            sortedHits.push(obj)
          }
        }

        resp.hits.hits = sortedHits

        resp.query = query
        return res.json(resp)
      },
      function (err) {
        return res.json({
          query,
          err,
        })
      }
    )
}

/*
module.exports = {
  path: '/api/',
  handler: app
}
*/

const port = '3001'
app.listen(port, () => {
  console.log(`app start listening on port ${port}`)
})

module.exports.handler = serverless(app) // <- 追加
