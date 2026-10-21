var DDIA_CHAPTERS = {

ch1:{title:'Ch 1: Trade-Offs in Data Systems Architecture',
  summary:[
    {id:'ch1-s1',name:'Operational vs Analytical Systems',content:'<h3>Two fundamentally different workloads</h3><table><thead><tr><th>Aspect</th><th>OLTP (Operational)</th><th>OLAP (Analytical)</th></tr></thead><tbody><tr><td>Purpose</td><td>Run the business</td><td>Understand the business</td></tr><tr><td>Queries</td><td>Simple, by key</td><td>Complex aggregations</td></tr><tr><td>Volume</td><td>Many small reads/writes</td><td>Few large scans</td></tr><tr><td>Latency</td><td>Milliseconds</td><td>Seconds to minutes</td></tr></tbody></table><div class="tip"><div class="tip__label">Key Insight</div><p>Don\'t mix OLTP and OLAP in one system. Separate them.</p></div>'},
    {id:'ch1-s2',name:'Systems of Record vs Derived Data',content:'<h3>Two types of data</h3><ul><li><strong>System of record (source of truth):</strong> Authoritative version. Where data is first written.</li><li><strong>Derived data:</strong> Computed from the source of truth. Can be rebuilt.</li></ul><p>If derived data is lost, rebuild it. If source of truth is lost, it\'s gone forever.</p>'},
    {id:'ch1-s3',name:'Cloud vs Self-Hosting',content:'<table><thead><tr><th>Factor</th><th>Cloud</th><th>Self-hosted</th></tr></thead><tbody><tr><td>Ops burden</td><td>Low</td><td>High</td></tr><tr><td>Cost at scale</td><td>Higher</td><td>Lower</td></tr><tr><td>Flexibility</td><td>Limited</td><td>Full control</td></tr><tr><td>Time to deploy</td><td>Minutes</td><td>Days</td></tr></tbody></table>'},
    {id:'ch1-s4',name:'Distributed vs Single-Node',content:'<ul><li><strong>Stay single-node when:</strong> Data fits in one machine. Simpler, faster, fewer bugs.</li><li><strong>Go distributed when:</strong> Data exceeds one machine, need HA across regions, need horizontal scaling.</li></ul><p><strong>Core message:</strong> Distribution adds complexity. Don\'t distribute unless you must.</p>'}
  ],
  flashcards:[
    {q:'What is the difference between OLTP and OLAP?',a:'OLTP = operational (many small reads/writes, ms latency). OLAP = analytical (complex aggregations, seconds latency).'},
    {q:'What is a "system of record"?',a:'The authoritative source-of-truth. If lost, it cannot be rebuilt.'},
    {q:'What is "derived data"?',a:'Data computed from the source of truth. Can be rebuilt if lost. Examples: caches, search indexes, analytics tables.'},
    {q:'When should you use a distributed system?',a:'Only when data exceeds one machine, you need HA across regions, or need horizontal scaling. Distribution adds complexity.'},
    {q:'Why not mix OLTP and OLAP?',a:'Different access patterns compete for resources. Analytics queries slow down operational queries.'}
  ],
  quiz:[
    {q:'Reports on a PostgreSQL DB are slowing transactions. What to do?',opts:['Add more CPU','Create read replicas','Separate into OLTP + OLAP','Switch to MongoDB'],correct:2,explain:'Separate OLTP (Cloud SQL) from OLAP (BigQuery). Fundamental split.'},
    {q:'Your BigQuery table is corrupted. Is it a disaster?',opts:['Yes, data is lost','No, rebuild from source of truth','Only without backups','Depends on size'],correct:1,explain:'BigQuery tables are derived data. Rebuild from the system of record.'},
    {q:'A startup with 100GB wants a distributed architecture. Best advice?',opts:['Use Spanner','Build microservices on K8s','Stay on single PostgreSQL','Multi-region replication'],correct:2,explain:'100GB fits on one machine. Distribution adds unnecessary complexity at this scale.'}
  ],
  palace:[
    {room:'Front Door',desc:'Where you choose your path',items:[{obj:'Two doors',concept:'OLTP (fast revolving) vs OLAP (wide warehouse door)'}]},
    {room:'Living Room',desc:'Where truth lives',items:[{obj:'Photo album',concept:'System of record (irreplaceable)'},{obj:'TV showing photos',concept:'Derived data (rebuildable)'}]},
    {room:'Window',desc:'Inside vs outside',items:[{obj:'Cloud outside',concept:'Cloud hosting'},{obj:'Fireplace inside',concept:'Self-hosting (you control it)'}]}
  ],
  scenarios:[
    {context:'Fintech app: 500 txn/sec, real-time fraud dashboards.',question:'One database or separate systems?',answer:'Separate. Cloud SQL/Spanner for OLTP transactions. BigQuery for OLAP dashboards. Dataflow to sync. Mixing would cause analytics to slow transactions.'},
    {context:'Search index built from orders DB got corrupted overnight.',question:'How worried should you be?',answer:'Not very. Search index is derived data — rebuild from the orders DB (source of truth). This is why understanding source of truth vs derived matters.'}
  ],
  gcpmap:[
    {concept:'OLTP',service:'Cloud SQL / Spanner / AlloyDB',why:'Low-latency reads/writes, ACID, row-based'},
    {concept:'OLAP',service:'BigQuery',why:'Columnar, aggregations, serverless'},
    {concept:'System of Record',service:'Cloud SQL / Spanner',why:'Source of truth, strong consistency'},
    {concept:'Derived Data',service:'BigQuery, Bigtable, Memorystore',why:'Rebuilt from source, optimized for access patterns'},
    {concept:'OLTP to OLAP sync',service:'Dataflow / CDC',why:'Move data without coupling systems'}
  ]
},

ch2:{title:'Ch 2: Defining Nonfunctional Requirements',
  summary:[
    {id:'ch2-s1',name:'Reliability',content:'<h3>The system works correctly even when things go wrong</h3><ul><li><strong>Hardware faults:</strong> Disks fail, RAM corrupts, power goes out. Solution: redundancy (RAID, multi-zone).</li><li><strong>Software faults:</strong> Bugs, memory leaks, cascading failures. Harder to predict than hardware faults.</li><li><strong>Human errors:</strong> Configuration mistakes cause most outages. Solution: good interfaces, testing, rollback ability.</li></ul><div class="tip"><div class="tip__label">Key Insight</div><p>Human errors cause more outages than hardware failures. Design systems that make it hard to do the wrong thing.</p></div>'},
    {id:'ch2-s2',name:'Scalability',content:'<h3>Describing load and performance</h3><ul><li><strong>Load parameters:</strong> Requests/sec, read/write ratio, concurrent users, data volume</li><li><strong>Percentiles:</strong> p50 (median), p95, p99 — more useful than averages. One slow request affects the whole user experience.</li><li><strong>Tail latency:</strong> p99.9 matters because your biggest customers often trigger the most complex queries.</li></ul><h3>Scaling approaches</h3><table><thead><tr><th>Type</th><th>How</th><th>When</th></tr></thead><tbody><tr><td><strong>Vertical</strong></td><td>Bigger machine</td><td>Simple, limited ceiling</td></tr><tr><td><strong>Horizontal</strong></td><td>More machines</td><td>Complex, unlimited ceiling</td></tr></tbody></table>'},
    {id:'ch2-s3',name:'Maintainability',content:'<h3>Three design principles</h3><ul><li><strong>Operability:</strong> Make it easy to run. Good monitoring, automation, documentation.</li><li><strong>Simplicity:</strong> Remove accidental complexity. Abstraction is the best tool.</li><li><strong>Evolvability:</strong> Make it easy to change. Modular design, loose coupling.</li></ul><p>Most of a system\'s cost is ongoing maintenance, not initial development.</p>'}
  ],
  flashcards:[
    {q:'What are the three nonfunctional requirements?',a:'Reliability (works when things fail), Scalability (handles growth), Maintainability (easy to operate, change, simplify).'},
    {q:'Why are percentiles better than averages for measuring latency?',a:'Averages hide outliers. p95 tells you "95% of users experience this latency or less." One slow request at p99.9 can ruin the experience for your biggest customers.'},
    {q:'What is tail latency amplification?',a:'In a fan-out system, the overall response time is determined by the slowest backend. With many backends, the chance of hitting a slow one increases. p99 of one service becomes p50 of the fan-out.'},
    {q:'What causes most system outages?',a:'Human errors (configuration mistakes), not hardware failures. Design systems that make it hard to do the wrong thing.'},
    {q:'Vertical vs horizontal scaling?',a:'Vertical = bigger machine (simple, has a ceiling). Horizontal = more machines (complex, unlimited). Most systems combine both.'}
  ],
  quiz:[
    {q:'Your API has p50=50ms, p99=2s. The average is 200ms. A manager says "performance is fine." Is it?',opts:['Yes, 200ms is fast','No, 1% of users wait 2 seconds','Need more data','Depends on traffic'],correct:1,explain:'The p99=2s means 1 in 100 requests takes 2+ seconds. These are often your most important users. Never rely on averages — use percentiles.'},
    {q:'A microservice calls 5 backends. Each has p99=100ms. What is the overall p99?',opts:['100ms','500ms','Higher than 100ms but less than 500ms','Need more info'],correct:2,explain:'Tail latency amplification. The overall latency is the MAX of all 5 backends. The probability that at least one is slow increases with more backends. Overall p99 will be higher than any individual p99.'}
  ],
  palace:[
    {room:'Bathroom Mirror',desc:'Reflecting on what matters',items:[{obj:'Three towels (R, S, M)',concept:'Reliability, Scalability, Maintainability'},{obj:'Cracked mirror',concept:'Hardware fault (things break)'},{obj:'Wrong toothbrush',concept:'Human error (most common cause of outages)'}]},
    {room:'Bathroom Scale',desc:'Measuring things',items:[{obj:'Scale showing average weight',concept:'Averages lie — use percentiles'},{obj:'The heaviest person at p99',concept:'Tail latency — your biggest customers hit the worst case'}]}
  ],
  scenarios:[
    {context:'Your e-commerce API averages 100ms response time. But during sales, some users complain about 5-second loads.',question:'How do you investigate and fix this?',answer:'Check p95 and p99 latency, not averages. The slow users are hitting tail latency. Investigate: are certain queries slow? Are some backends overloaded? Solutions: add caching for hot paths, set timeouts, use circuit breakers, scale horizontally during sales.'}
  ],
  gcpmap:[
    {concept:'Reliability (redundancy)',service:'Multi-zone MIGs, Cloud SQL HA, regional GKE',why:'Survive zone failures automatically'},
    {concept:'Latency percentiles',service:'Cloud Monitoring (custom metrics, SLIs)',why:'Track p50, p95, p99 as SLIs for your SLOs'},
    {concept:'Vertical scaling',service:'Compute Engine (change machine type)',why:'Resize VM with zero code changes'},
    {concept:'Horizontal scaling',service:'GKE HPA, Cloud Run autoscaling, MIGs',why:'Add instances automatically based on load'},
    {concept:'Operability',service:'Cloud Monitoring + Logging + Error Reporting',why:'Observability stack for easy operations'}
  ]
},

ch3:{title:'Ch 3: Data Models & Query Languages',
  summary:[
    {id:'ch3-s1',name:'Relational Model',content:'<h3>Tables, rows, columns, SQL</h3><p>Data organized in relations (tables). Enforces schema (schema-on-write). Joins relate data across tables. SQL provides declarative queries.</p><ul><li><strong>Strengths:</strong> Joins, transactions, strong consistency, mature ecosystem</li><li><strong>Weaknesses:</strong> Rigid schema, object-relational mismatch, limited horizontal scaling</li></ul>'},
    {id:'ch3-s2',name:'Document Model',content:'<h3>JSON/BSON documents, schema-on-read</h3><p>Data stored as self-contained documents. No joins — related data nested inside the document.</p><ul><li><strong>Strengths:</strong> Flexible schema, locality (one read gets everything), maps to application objects</li><li><strong>Weaknesses:</strong> Difficult joins, data duplication, weak for many-to-many relationships</li></ul><div class="tip"><div class="tip__label">Decision Rule</div><p>If your data is mostly tree-like (one-to-many) → document model. If many-to-many relationships → relational model.</p></div>'},
    {id:'ch3-s3',name:'Graph Model',content:'<h3>Nodes, edges, properties</h3><p>For data with complex, interconnected relationships. Each node is an entity, each edge is a relationship.</p><ul><li><strong>Use when:</strong> Social networks, fraud detection, recommendation engines, knowledge graphs</li><li><strong>Query languages:</strong> Cypher (Neo4j), SPARQL, Gremlin</li></ul>'},
    {id:'ch3-s4',name:'Query Languages: Declarative vs Imperative',content:'<h3>Tell the system WHAT you want, not HOW</h3><ul><li><strong>Declarative (SQL):</strong> "Give me all orders over $100." The optimizer decides how.</li><li><strong>Imperative (code):</strong> "Loop through orders, check amount, add to results." You decide how.</li></ul><p>Declarative is better for databases because the optimizer can change strategy without changing your query.</p>'}
  ],
  flashcards:[
    {q:'Relational vs Document model: when to use each?',a:'Relational: many-to-many relationships, need joins, strong consistency. Document: tree-like data (one-to-many), flexible schema, data locality.'},
    {q:'What is schema-on-write vs schema-on-read?',a:'Schema-on-write (relational): enforce schema when writing. Schema-on-read (document): interpret structure when reading. Like static typing vs dynamic typing.'},
    {q:'When should you use a graph database?',a:'When data has complex many-to-many relationships: social networks, fraud detection, recommendation engines, knowledge graphs.'},
    {q:'Why is declarative (SQL) better than imperative for databases?',a:'The optimizer can choose the best execution plan. If data layout changes, your query stays the same — the optimizer adapts.'},
    {q:'What is the main weakness of document databases?',a:'Difficult joins. If you need to relate data across documents (many-to-many), you end up doing joins in application code, which is slower and harder.'}
  ],
  quiz:[
    {q:'You\'re building a social network. Users have friends, posts, comments, likes — all interconnected. Best data model?',opts:['Relational (PostgreSQL)','Document (MongoDB)','Graph (Neo4j)','Key-value (Redis)'],correct:2,explain:'Social networks are highly interconnected (many-to-many). Graph databases excel at traversing relationships like "friends of friends who liked posts about X."'},
    {q:'Your app stores user profiles with nested addresses, phone numbers, and preferences. Profiles are read as a whole unit. Best model?',opts:['Relational with joins','Document (one document per user)','Graph','Flat key-value'],correct:1,explain:'Tree-like data (one user → many addresses/phones) that\'s read as a unit = perfect for document model. One read gets the entire profile.'}
  ],
  palace:[
    {room:'Dining Table',desc:'Where data is organized',items:[{obj:'Set table with plates in rows',concept:'Relational model (tables with rows and columns)'},{obj:'Bento box',concept:'Document model (self-contained, everything in one box)'},{obj:'Spider web decoration',concept:'Graph model (everything connected)'}]},
    {room:'Menu card',desc:'How you order',items:[{obj:'Point at a picture',concept:'Declarative (WHAT you want)'},{obj:'Write cooking instructions',concept:'Imperative (HOW to make it)'}]}
  ],
  scenarios:[
    {context:'An e-commerce platform needs to store: products (with nested variants, images, specs), orders (with line items), and a recommendation engine showing "customers who bought X also bought Y."',question:'Which data model(s) do you use?',answer:'Hybrid. Products → document model (tree-like, nested variants/images). Orders → relational (need joins between customers, products, payments, ACID transactions). Recommendations → graph model (many-to-many relationships between customers and products). In GCP: Firestore for product catalog, Cloud SQL for orders, BigQuery for recommendation queries.'}
  ],
  gcpmap:[
    {concept:'Relational model',service:'Cloud SQL, Spanner, AlloyDB',why:'SQL, ACID, joins, schema enforcement'},
    {concept:'Document model',service:'Firestore',why:'JSON documents, flexible schema, nested data'},
    {concept:'Graph model',service:'Spanner Graph, BigQuery Graph',why:'Spanner added graph queries in 2026. BigQuery Graph for analytics.'},
    {concept:'Schema-on-read',service:'BigQuery (external tables on GCS)',why:'Query JSON/Parquet in GCS without defining schema upfront'},
    {concept:'Declarative queries',service:'BigQuery SQL',why:'Write SQL, BigQuery optimizer handles execution plan'}
  ]
},

ch4:{title:'Ch 4: Storage and Retrieval',
  summary:[
    {id:'ch4-s1',name:'Log-Structured Storage (LSM Trees)',content:'<h3>Append-only, merge later</h3><ul><li>Writes go to an in-memory table (memtable)</li><li>When memtable is full, flush to disk as a sorted file (SSTable)</li><li>Background compaction merges SSTables</li><li><strong>Fast writes</strong>, slower reads (may check multiple SSTables)</li></ul><p><strong>Used by:</strong> Cassandra, HBase, LevelDB, RocksDB, <strong>Bigtable</strong></p>'},
    {id:'ch4-s2',name:'B-Tree Storage',content:'<h3>Update in place, balanced tree</h3><ul><li>Data stored in fixed-size pages (typically 4KB)</li><li>Tree structure with branching factor ~500</li><li>Updates modify pages in place + write-ahead log (WAL) for crash recovery</li><li><strong>Fast reads</strong> (one tree traversal), slower writes (random I/O)</li></ul><p><strong>Used by:</strong> PostgreSQL, MySQL, <strong>Cloud SQL, Spanner</strong></p>'},
    {id:'ch4-s3',name:'LSM Trees vs B-Trees',content:'<table><thead><tr><th>Aspect</th><th>LSM Trees</th><th>B-Trees</th></tr></thead><tbody><tr><td>Write speed</td><td>Fast (sequential)</td><td>Slower (random I/O)</td></tr><tr><td>Read speed</td><td>Slower (check multiple files)</td><td>Fast (one traversal)</td></tr><tr><td>Space</td><td>More compact</td><td>More fragmentation</td></tr><tr><td>Write amplification</td><td>Compaction rewrites data</td><td>WAL + page writes</td></tr></tbody></table><div class="tip"><div class="tip__label">Decision Rule</div><p>Write-heavy workload → LSM (Bigtable, Cassandra). Read-heavy workload → B-Tree (PostgreSQL, Cloud SQL).</p></div>'},
    {id:'ch4-s4',name:'Column-Oriented Storage',content:'<h3>Store columns together, not rows</h3><p>Instead of storing all fields of a row together, store all values of a column together. Enables:</p><ul><li><strong>Compression:</strong> Similar values in a column compress well</li><li><strong>Vectorized processing:</strong> CPU can process column batches efficiently</li><li><strong>Skip irrelevant columns:</strong> Only read columns you need</li></ul><p><strong>Used by:</strong> BigQuery (Capacitor), Redshift, Parquet files</p>'},
    {id:'ch4-s5',name:'Indexes',content:'<h3>Trade-off: faster reads, slower writes</h3><ul><li><strong>Primary index:</strong> Determines physical order of data (clustered)</li><li><strong>Secondary index:</strong> Separate structure pointing to rows</li><li><strong>Covering index:</strong> Stores column values in the index itself (no table lookup)</li><li><strong>Multi-column index:</strong> Concatenated keys for compound queries</li></ul><p>Every index speeds up reads but slows down writes (must update the index too).</p>'}
  ],
  flashcards:[
    {q:'How do LSM Trees work?',a:'Writes go to in-memory memtable → flush to sorted SSTable on disk → background compaction merges SSTables. Fast writes, slower reads.'},
    {q:'How do B-Trees work?',a:'Balanced tree of fixed-size pages. Updates modify pages in place + write-ahead log for crash recovery. Fast reads, slower writes.'},
    {q:'LSM vs B-Tree: when to use each?',a:'LSM: write-heavy (Bigtable, Cassandra). B-Tree: read-heavy (PostgreSQL, Cloud SQL).'},
    {q:'Why is columnar storage good for analytics?',a:'1) Compression (similar values). 2) Vectorized processing. 3) Skip irrelevant columns. Only read what you need.'},
    {q:'What is write amplification?',a:'One logical write causes multiple physical writes. LSM: compaction rewrites data. B-Tree: WAL + page updates. Both have it, different patterns.'},
    {q:'What is the trade-off of adding an index?',a:'Faster reads, slower writes. Every write must update the index too. Don\'t add indexes you don\'t use.'}
  ],
  quiz:[
    {q:'You need a database for IoT sensors writing 100K events/sec with occasional analytical queries. Best storage engine?',opts:['B-Tree (PostgreSQL)','LSM Tree (Bigtable)','Columnar (BigQuery)','Key-value (Redis)'],correct:1,explain:'100K writes/sec = write-heavy workload. LSM Trees (Bigtable) excel at high write throughput with sequential I/O. B-Trees would struggle with random I/O at this rate.'},
    {q:'An analytics query scans 1TB table but only needs 3 of 50 columns. Row-oriented storage reads all 50. How much data does columnar skip?',opts:['None','About 47/50 = 94%','About 50%','Depends on compression'],correct:1,explain:'Columnar storage reads only the 3 needed columns, skipping 47 others. That\'s ~94% less I/O. This is why BigQuery (columnar) is so fast for analytics.'}
  ],
  palace:[
    {room:'Bookshelf',desc:'Where data is stored and retrieved',items:[{obj:'Stack of notebooks (append only)',concept:'LSM Tree — write at the end, sort later'},{obj:'Encyclopedia with alphabetical tabs',concept:'B-Tree — organized for lookup, update in place'},{obj:'Spreadsheet on the wall (columns)',concept:'Columnar storage — data stored by column'}]},
    {room:'Sticky notes on books',desc:'Finding things faster',items:[{obj:'Post-it tabs on pages',concept:'Indexes — speed up reads, cost on writes'},{obj:'Table of contents',concept:'Primary index — determines physical order'}]}
  ],
  scenarios:[
    {context:'Vigil receives 45K security events/sec. Each event has 30 fields. Analysts query 3-4 fields at a time for threat detection.',question:'What storage architecture?',answer:'Two layers. 1) Bigtable (LSM) for ingestion — handles 45K writes/sec with low latency. Row key = reversed timestamp + device ID. 2) BigQuery (columnar) for analysis — analysts query only 3-4 of 30 fields, columnar skips 87% of data. Dataflow streams from Bigtable to BigQuery.'}
  ],
  gcpmap:[
    {concept:'LSM Tree storage',service:'Bigtable',why:'Write-optimized, handles massive write throughput'},
    {concept:'B-Tree storage',service:'Cloud SQL, Spanner, AlloyDB',why:'Read-optimized, ACID transactions'},
    {concept:'Columnar storage',service:'BigQuery (Capacitor format)',why:'Analytics-optimized, compression, skip columns'},
    {concept:'Indexes',service:'Cloud SQL indexes, Spanner interleaved tables',why:'Speed up reads at cost of write performance'},
    {concept:'Write-ahead log',service:'Cloud SQL (WAL), AlloyDB',why:'Crash recovery — replay WAL to restore state'}
  ]
},

ch5:{title:'Ch 5: Encoding and Evolution',
  summary:[
    {id:'ch5-s1',name:'Data Encoding Formats',content:'<table><thead><tr><th>Format</th><th>Pros</th><th>Cons</th></tr></thead><tbody><tr><td><strong>JSON</strong></td><td>Human-readable, ubiquitous</td><td>Verbose, no schema enforcement, number ambiguity</td></tr><tr><td><strong>Protocol Buffers</strong></td><td>Compact, fast, schema-defined, backward/forward compatible</td><td>Not human-readable</td></tr><tr><td><strong>Avro</strong></td><td>Compact, schema evolution, good for Hadoop/Dataflow</td><td>Need schema to read</td></tr><tr><td><strong>Parquet</strong></td><td>Columnar, great for analytics, compressed</td><td>Not for streaming</td></tr></tbody></table>'},
    {id:'ch5-s2',name:'Schema Evolution & Compatibility',content:'<h3>Changing schemas without breaking things</h3><ul><li><strong>Backward compatible:</strong> New code can read old data (add fields with defaults)</li><li><strong>Forward compatible:</strong> Old code can read new data (ignore unknown fields)</li></ul><p>Protocol Buffers and Avro handle this via field tags/numbers. JSON has no built-in mechanism.</p><div class="tip"><div class="tip__label">Architecture Rule</div><p>Always design for schema evolution. Data outlives code. The schema you choose today must support changes for years.</p></div>'},
    {id:'ch5-s3',name:'Modes of Data Flow',content:'<h3>How data moves between systems</h3><ul><li><strong>Via databases:</strong> One process writes, another reads. Schema must be backward compatible.</li><li><strong>Via APIs (REST/gRPC):</strong> Client-server. Versioning needed.</li><li><strong>Via message queues:</strong> Producer-consumer. Schema must be forward + backward compatible (producers and consumers upgrade independently).</li></ul>'}
  ],
  flashcards:[
    {q:'JSON vs Protocol Buffers vs Avro: when to use each?',a:'JSON: APIs, human-readable config. Protobuf: internal services, gRPC, need schema enforcement. Avro: data pipelines, Hadoop/Dataflow, schema evolution in data lakes.'},
    {q:'What is backward compatibility?',a:'New code can read old data. Achieved by adding new fields with default values so old records without the field still work.'},
    {q:'What is forward compatibility?',a:'Old code can read new data. Achieved by ignoring unknown fields. Old code skips fields it doesn\'t recognize.'},
    {q:'Why does "data outlive code"?',a:'Code gets rewritten every few years. Data in databases and files lasts decades. Your encoding format and schema must support evolution over time.'},
    {q:'Parquet vs Avro?',a:'Parquet: columnar, for analytics (read specific columns). Avro: row-based, for data pipelines (read/write complete records). Both are compact and schema-based.'}
  ],
  quiz:[
    {q:'You add a new field "phone_number" to your user schema. Old records don\'t have it. What ensures backward compatibility?',opts:['Delete old records','Make phone_number required','Add a default value for phone_number','Migrate all old records first'],correct:2,explain:'Backward compatibility = new code reads old data. A default value means old records without phone_number still work. Required fields without defaults break backward compatibility.'},
    {q:'Your Dataflow pipeline writes Avro files. Downstream readers use an older schema. What compatibility do you need?',opts:['Backward only','Forward only','Both backward and forward','Neither'],correct:2,explain:'In async systems (pipelines/queues), producers and consumers upgrade independently. Need both: new writers produce data old readers can handle (forward), and new readers can handle old data (backward).'}
  ],
  palace:[
    {room:'Mailbox',desc:'How data travels between systems',items:[{obj:'Postcard (readable by anyone)',concept:'JSON — human-readable, no envelope needed'},{obj:'Sealed envelope with tracking number',concept:'Protobuf — compact, numbered fields, tracked'},{obj:'Package with shipping label',concept:'Avro — schema travels with the data'}]},
    {room:'Mail slot',desc:'Compatibility',items:[{obj:'New mailbox fits old letters',concept:'Backward compatible (new reads old)'},{obj:'Old mailbox accepts new packages',concept:'Forward compatible (old reads new)'}]}
  ],
  scenarios:[
    {context:'Your Dataflow pipeline processes Avro events. The product team wants to add a new field "user_segment" to events. The pipeline, BigQuery, and downstream consumers must keep working during the rollout.',question:'How do you manage this schema change?',answer:'Add "user_segment" with a default value (backward compatible). Deploy the new Avro schema with Avro\'s schema registry. Producers upgrade first (start writing the new field). Consumers upgrade at their own pace — Avro handles forward compatibility automatically. BigQuery schema can be updated with ALTER TABLE ADD COLUMN.'}
  ],
  gcpmap:[
    {concept:'JSON encoding',service:'REST APIs, Firestore, BigQuery (JSON format)',why:'Universal, human-readable, used everywhere'},
    {concept:'Protocol Buffers',service:'gRPC, Pub/Sub, Dataflow (internal)',why:'GCP services use protobuf internally for efficiency'},
    {concept:'Avro',service:'Dataflow, Cloud Storage (data lake)',why:'Schema evolution for data pipelines'},
    {concept:'Parquet',service:'BigQuery (external tables), GCS',why:'Columnar format for analytics, great compression'},
    {concept:'Schema evolution',service:'BigQuery (ALTER TABLE), Pub/Sub Schema Registry',why:'Add columns, evolve schemas without breaking consumers'}
  ]
},

ch6:{title:'Ch 6: Replication',
  summary:[
    {id:'ch6-s1',name:'Why Replicate?',content:'<ul><li><strong>High availability:</strong> If one node dies, another takes over</li><li><strong>Low latency:</strong> Place data close to users geographically</li><li><strong>Read scalability:</strong> Spread read load across replicas</li></ul>'},
    {id:'ch6-s2',name:'Leader-Based Replication',content:'<ul><li>One <strong>leader</strong> handles all writes</li><li>Multiple <strong>followers</strong> replicate from leader</li></ul><table><thead><tr><th>Type</th><th>Guarantee</th><th>Trade-off</th></tr></thead><tbody><tr><td><strong>Synchronous</strong></td><td>Follower confirmed before commit</td><td>Slower, stronger durability</td></tr><tr><td><strong>Asynchronous</strong></td><td>Leader commits without waiting</td><td>Faster, risk of data loss</td></tr></tbody></table>'},
    {id:'ch6-s3',name:'Replication Lag Problems',content:'<ul><li><strong>Read-after-write:</strong> User writes then reads stale data from lagging replica</li><li><strong>Monotonic reads:</strong> Data goes "backward" reading from different replicas</li><li><strong>Consistent prefix:</strong> Causally related events appear out of order</li></ul><div class="tip"><div class="tip__label">Key Insight</div><p>Replication lag is the source of most "weird" database behavior.</p></div>'},
    {id:'ch6-s4',name:'Multi-Leader and Leaderless',content:'<h3>Multi-Leader:</h3><p>Multiple nodes accept writes. Problem: write conflicts.</p><h3>Leaderless (Dynamo-style):</h3><p>Any node accepts reads/writes. Uses quorum: W + R > N guarantees reading latest write.</p>'}
  ],
  flashcards:[
    {q:'Three reasons to replicate data?',a:'1) High availability. 2) Low latency (data near users). 3) Read scalability.'},
    {q:'Sync vs async replication?',a:'Sync: leader waits for follower — slower, durable. Async: leader commits immediately — faster, may lose data.'},
    {q:'What is read-after-write consistency?',a:'After writing, you can immediately read it back. Async replication breaks this if you read from a lagging replica.'},
    {q:'What is a quorum?',a:'Write to W nodes, read from R nodes. If W+R > N, at least one read node has the latest write.'},
    {q:'When does multi-leader cause problems?',a:'Write conflicts: two leaders modify the same data simultaneously. Must resolve conflicts.'}
  ],
  quiz:[
    {q:'User updates profile, refreshes, sees old version. What happened?',opts:['DB corrupted','Reading from lagging replica','Write failed','Cache stale'],correct:1,explain:'Read-after-write consistency problem. Write went to leader, read hit a lagging follower.'},
    {q:'Global app needs DB in 3 regions. Best replication model?',opts:['Single-leader with followers','Multi-leader (one per region)','Leaderless with quorum','No replication'],correct:1,explain:'Multi-leader gives each region a writable node. This is how Spanner works.'}
  ],
  palace:[
    {room:'Kitchen',desc:'Data gets cooked and served',items:[{obj:'Head chef',concept:'Leader (handles all writes)'},{obj:'Sous chefs copying recipes',concept:'Followers'},{obj:'Waiter confirms delivery',concept:'Sync replication'},{obj:'Waiter leaves food at pass',concept:'Async replication'}]}
  ],
  scenarios:[
    {context:'E-commerce with Cloud SQL + read replica. Flash sale: customer orders but "My Orders" shows empty.',question:'What happened and fix?',answer:'Read-after-write violation. Order written to primary, "My Orders" read from lagging replica. Fix: route post-write reads to primary for that user.'}
  ],
  gcpmap:[
    {concept:'Single-leader',service:'Cloud SQL HA',why:'Primary + standby, auto failover'},
    {concept:'Read replicas',service:'Cloud SQL Read Replicas',why:'Async followers for read scaling'},
    {concept:'Multi-leader (global)',service:'Spanner',why:'Global writes with TrueTime consistency'},
    {concept:'Quorum',service:'Firestore',why:'Quorum writes for strong consistency'}
  ]
},

ch7:{title:'Ch 7: Partitioning',
  summary:[
    {id:'ch7-s1',name:'Why Partition?',content:'<p>When data is too big for one machine, split it across multiple nodes. Each partition (shard) holds a subset of the data.</p><ul><li><strong>Goal:</strong> Spread data and load evenly across nodes</li><li><strong>Risk:</strong> Hot spots — one partition gets disproportionate traffic</li></ul>'},
    {id:'ch7-s2',name:'Partitioning Strategies',content:'<table><thead><tr><th>Strategy</th><th>How</th><th>Pros</th><th>Cons</th></tr></thead><tbody><tr><td><strong>By key range</strong></td><td>Split by ranges (A-F, G-M, N-Z)</td><td>Range queries efficient</td><td>Hot spots if keys are sequential</td></tr><tr><td><strong>By hash</strong></td><td>Hash the key, assign to partition</td><td>Even distribution</td><td>Range queries impossible</td></tr></tbody></table><div class="tip"><div class="tip__label">Key Insight</div><p>Bigtable uses key range partitioning — that\'s why row key design is critical. Bad row keys = hot spots.</p></div>'},
    {id:'ch7-s3',name:'Secondary Indexes and Partitioning',content:'<ul><li><strong>Local index:</strong> Each partition has its own index. Writes are fast, reads must scatter-gather across all partitions.</li><li><strong>Global index:</strong> One index across all partitions. Reads are fast, writes must update multiple partitions.</li></ul>'},
    {id:'ch7-s4',name:'Rebalancing',content:'<p>When partitions grow unevenly or nodes are added, data must be rebalanced. Strategies:</p><ul><li><strong>Fixed number of partitions:</strong> Create many partitions upfront, assign to nodes</li><li><strong>Dynamic partitioning:</strong> Split partitions when they get too large</li><li><strong>Proportional:</strong> Number of partitions proportional to number of nodes</li></ul>'}
  ],
  flashcards:[
    {q:'Key range vs hash partitioning?',a:'Key range: efficient range queries, risk of hot spots. Hash: even distribution, no range queries. Bigtable uses key range (row key design matters).'},
    {q:'What causes hot spots in partitioned databases?',a:'Uneven key distribution. Example: timestamp as row key in Bigtable — all writes go to the latest partition. Fix: add hash prefix to row key.'},
    {q:'Local vs global secondary index?',a:'Local: each partition has own index, fast writes, scatter-gather reads. Global: one index, fast reads, distributed writes.'},
    {q:'What is BigQuery partitioning?',a:'Divides tables by date/integer range. Queries on partitioned columns scan only relevant partitions. Reduces cost and improves speed.'}
  ],
  quiz:[
    {q:'Bigtable with row key = timestamp. All 45K writes/sec hit one tablet. Why?',opts:['Bigtable is slow','Timestamp keys create hot spots','Too few nodes','Network bottleneck'],correct:1,explain:'Sequential timestamps always go to the latest partition. Fix: reverse timestamp, add hash prefix, or use device_id+timestamp as row key.'},
    {q:'BigQuery table with 5TB. Queries always filter by date. How to optimize?',opts:['Add more slots','Partition by date','Create indexes','Use Bigtable instead'],correct:1,explain:'Partitioning by date means queries with date filters only scan relevant partitions, not all 5TB. Massive cost and speed improvement.'}
  ],
  palace:[
    {room:'Closet',desc:'Where you organize things into sections',items:[{obj:'Shirts sorted by color (range)',concept:'Key range partitioning (A-F, G-M)'},{obj:'Clothes randomly assigned to shelves',concept:'Hash partitioning (even distribution)'},{obj:'One shelf overflowing',concept:'Hot spot (uneven partition)'}]}
  ],
  scenarios:[
    {context:'Bigtable stores 45K events/sec from security cameras. Row key is the camera timestamp. One tablet is getting all the writes while others are idle.',question:'How do you fix the hot spot?',answer:'The sequential timestamp row key sends all writes to one partition. Fix: change row key to camera_id#reverse_timestamp. This distributes writes across partitions (by camera) while keeping each camera\'s events ordered (by time).'}
  ],
  gcpmap:[
    {concept:'Key range partitioning',service:'Bigtable (tablets)',why:'Row key determines which tablet stores the data'},
    {concept:'Hash partitioning',service:'Spanner (hash-based sharding)',why:'Automatic hash distribution across splits'},
    {concept:'Table partitioning',service:'BigQuery (time/integer partitioning)',why:'Skip partitions during queries, reduce cost'},
    {concept:'Clustering',service:'BigQuery clustering',why:'Sort data within partitions for even faster filtered queries'},
    {concept:'Rebalancing',service:'Bigtable (automatic tablet splitting)',why:'Tablets split when too large, merge when too small'}
  ]
},

ch8:{title:'Ch 8: Transactions',
  summary:[
    {id:'ch8-s1',name:'ACID Properties',content:'<table><thead><tr><th>Property</th><th>Meaning</th><th>What it prevents</th></tr></thead><tbody><tr><td><strong>Atomicity</strong></td><td>All or nothing</td><td>Partial writes after crash</td></tr><tr><td><strong>Consistency</strong></td><td>Invariants are maintained</td><td>Invalid data states</td></tr><tr><td><strong>Isolation</strong></td><td>Concurrent txns don\'t interfere</td><td>Race conditions</td></tr><tr><td><strong>Durability</strong></td><td>Committed data survives crashes</td><td>Data loss</td></tr></tbody></table>'},
    {id:'ch8-s2',name:'Isolation Levels',content:'<table><thead><tr><th>Level</th><th>Prevents</th><th>Allows</th><th>Performance</th></tr></thead><tbody><tr><td><strong>Read Uncommitted</strong></td><td>Nothing</td><td>Dirty reads</td><td>Fastest</td></tr><tr><td><strong>Read Committed</strong></td><td>Dirty reads</td><td>Non-repeatable reads</td><td>Fast</td></tr><tr><td><strong>Snapshot Isolation</strong></td><td>Non-repeatable reads</td><td>Write skew</td><td>Medium</td></tr><tr><td><strong>Serializable</strong></td><td>Everything</td><td>Nothing</td><td>Slowest</td></tr></tbody></table><div class="tip"><div class="tip__label">Key Insight</div><p>Most databases default to Read Committed or Snapshot Isolation — NOT serializable. Know what anomalies your isolation level allows.</p></div>'},
    {id:'ch8-s3',name:'Serializable Implementations',content:'<ul><li><strong>Actual serial execution:</strong> One transaction at a time (Redis, VoltDB). Simple but limited throughput.</li><li><strong>Two-phase locking (2PL):</strong> Readers block writers, writers block readers. Correct but slow.</li><li><strong>Serializable Snapshot Isolation (SSI):</strong> Optimistic — run in parallel, abort if conflict detected. Used by PostgreSQL and Spanner.</li></ul>'}
  ],
  flashcards:[
    {q:'What does ACID stand for?',a:'Atomicity (all or nothing), Consistency (invariants maintained), Isolation (concurrent txns don\'t interfere), Durability (committed data survives crashes).'},
    {q:'What is a dirty read?',a:'Reading data written by a transaction that hasn\'t committed yet. If that transaction aborts, you read data that never existed.'},
    {q:'What is write skew?',a:'Two transactions read the same data, make decisions based on it, then write — but the combined effect violates an invariant. Example: two doctors try to go off-call simultaneously.'},
    {q:'What isolation level does Spanner use?',a:'Serializable (via SSI with TrueTime). The strongest level — no anomalies. This is why Spanner is unique.'},
    {q:'Why don\'t most databases default to serializable?',a:'Performance. Serializable requires coordination between transactions, reducing throughput. Most apps tolerate weaker isolation.'}
  ],
  quiz:[
    {q:'Two users simultaneously transfer $100 from the same account with $150 balance. Without proper isolation, what can happen?',opts:['Nothing, databases handle it','Both succeed, account goes to -$50','One fails automatically','Deadlock'],correct:1,explain:'Without serializable isolation, both read $150, both deduct $100, account goes to -$50. This is a write skew anomaly. Need serializable isolation or explicit locking.'},
    {q:'A system needs global transactions across 3 regions with no anomalies. Which database?',opts:['Cloud SQL with read replicas','MongoDB','Spanner','BigQuery'],correct:2,explain:'Spanner provides serializable isolation globally using TrueTime. Cloud SQL is single-region. MongoDB doesn\'t do global serializable transactions.'}
  ],
  palace:[
    {room:'Bank Vault',desc:'Where transactions are processed',items:[{obj:'All-or-nothing light switch',concept:'Atomicity — on or off, never half'},{obj:'Security guard checking everyone',concept:'Isolation — one at a time through the door'},{obj:'Fireproof safe',concept:'Durability — survives disasters'},{obj:'Balance sheet that must add up',concept:'Consistency — invariants always hold'}]}
  ],
  scenarios:[
    {context:'A ticket booking system. Two users simultaneously try to book the last seat on a flight.',question:'How do you prevent double-booking?',answer:'Use serializable isolation or explicit row-level locking. In Spanner: both transactions read seat availability in a serializable transaction. One commits, the other detects the conflict and retries (finds no seats). In Cloud SQL: SELECT ... FOR UPDATE locks the row, blocking the second transaction until the first commits.'}
  ],
  gcpmap:[
    {concept:'ACID transactions',service:'Cloud SQL, Spanner, AlloyDB',why:'Full ACID support including isolation'},
    {concept:'Serializable isolation',service:'Spanner (global)',why:'Strongest isolation using TrueTime + SSI'},
    {concept:'Snapshot isolation',service:'Cloud SQL (PostgreSQL), AlloyDB',why:'Default isolation level, good for most workloads'},
    {concept:'No transactions',service:'Bigtable, BigQuery',why:'Bigtable: single-row atomic only. BigQuery: DML has limited transactions.'}
  ]
},

ch9:{title:'Ch 9: The Trouble with Distributed Systems',
  summary:[
    {id:'ch9-s1',name:'Unreliable Networks',content:'<p>In a distributed system, messages can be: <strong>lost, delayed, duplicated, or delivered out of order</strong>. You can never know if a remote node received your message unless it responds.</p><ul><li><strong>Timeout:</strong> How long do you wait? Too short = false failures. Too long = slow detection.</li><li><strong>Network partitions:</strong> Nodes can communicate within their group but not across groups.</li></ul>'},
    {id:'ch9-s2',name:'Unreliable Clocks',content:'<p>Each machine has its own clock. Clocks drift. You cannot trust that two machines agree on the current time.</p><ul><li><strong>NTP:</strong> Synchronizes clocks, but accuracy is limited (ms to 100ms)</li><li><strong>TrueTime (Spanner):</strong> Returns a time interval [earliest, latest] instead of a point. Waits for interval to pass before committing.</li></ul><div class="tip"><div class="tip__label">Key Insight</div><p>Never use wall-clock timestamps to determine ordering of events in a distributed system. Use logical clocks or TrueTime.</p></div>'},
    {id:'ch9-s3',name:'Truth and Lies in Distributed Systems',content:'<ul><li><strong>A node can\'t trust itself:</strong> Its clock might be wrong, its disk might be corrupt, it might be slow.</li><li><strong>Fencing tokens:</strong> When acquiring a lock, get a monotonically increasing token. The storage system rejects writes with old tokens.</li><li><strong>Byzantine faults:</strong> Nodes that actively lie (malicious or buggy). Most systems assume non-Byzantine (crash-stop model).</li></ul>'}
  ],
  flashcards:[
    {q:'What are the 3 things that can go wrong in a distributed system?',a:'1) Network: messages lost, delayed, duplicated. 2) Clocks: drift, disagree on time. 3) Processes: crash, pause (GC), slow.'},
    {q:'Why can\'t you use timestamps to order events?',a:'Clocks drift between machines. Machine A\'s 12:00:00 might be Machine B\'s 11:59:59. Use logical clocks (Lamport, vector clocks) or TrueTime.'},
    {q:'How does Spanner\'s TrueTime solve the clock problem?',a:'Returns a time interval [earliest, latest] instead of a point. Waits for the interval to pass before committing. Guarantees: if TrueTime says A happened before B, it really did.'},
    {q:'What is a fencing token?',a:'A monotonically increasing number given with a lock. Storage rejects writes with old tokens. Prevents stale lock holders from corrupting data.'},
    {q:'What is the difference between network delay and network partition?',a:'Delay: messages are slow but eventually arrive. Partition: nodes in different groups cannot communicate at all.'}
  ],
  quiz:[
    {q:'Two servers update the same record. Server A\'s clock says 12:00:01, Server B says 12:00:00. Last-writer-wins uses timestamps. Who wins?',opts:['Server A (later timestamp)','Server B (earlier timestamp)','Depends on actual order','Can\'t determine — clocks are unreliable'],correct:3,explain:'You cannot trust timestamps across machines. Server A\'s clock might be fast. The "real" order might be opposite. This is why last-writer-wins with timestamps loses data. Use vector clocks or Spanner\'s TrueTime instead.'}
  ],
  palace:[
    {room:'Garage',desc:'Where things break and get unreliable',items:[{obj:'Car radio with static',concept:'Unreliable network — messages lost/delayed'},{obj:'Each wall clock shows different time',concept:'Unreliable clocks — machines disagree'},{obj:'Garage door stuck halfway',concept:'Partial failure — part of the system works, part doesn\'t'}]}
  ],
  scenarios:[
    {context:'Your distributed cache uses timestamps for cache invalidation. Sometimes users see stale data even after updates.',question:'Why and how do you fix it?',answer:'Clock skew between servers. The update server\'s clock might be behind the cache server\'s clock, so the cache thinks the update is "older" than the current cached value. Fix: use version numbers (monotonically increasing) instead of timestamps for cache invalidation.'}
  ],
  gcpmap:[
    {concept:'TrueTime (reliable clocks)',service:'Spanner',why:'GPS + atomic clocks for global time agreement'},
    {concept:'Network partitions',service:'Multi-region design, health checks',why:'Design for network failures between regions'},
    {concept:'Timeouts',service:'Cloud Run (request timeout), gRPC deadlines',why:'Set appropriate timeouts to detect failures'},
    {concept:'Fencing',service:'Cloud Storage (generation numbers)',why:'Conditional writes using object generation — prevents overwrite conflicts'}
  ]
},

ch10:{title:'Ch 10: Consistency and Consensus',
  summary:[
    {id:'ch10-s1',name:'Linearizability',content:'<p>The strongest consistency model. Makes a distributed system <strong>behave as if there\'s only one copy of the data</strong>.</p><ul><li>Once a write is confirmed, all subsequent reads see it</li><li>No stale reads, ever</li><li>Expensive: requires coordination between nodes</li></ul><p><strong>CAP Theorem:</strong> During a network partition, choose Consistency (linearizable) or Availability (respond from any node). Can\'t have both.</p>'},
    {id:'ch10-s2',name:'Ordering and Causality',content:'<ul><li><strong>Causal consistency:</strong> If event A caused event B, everyone sees A before B. Weaker than linearizability but more practical.</li><li><strong>Lamport timestamps:</strong> Logical clock that assigns order to events. But can\'t tell if two events are concurrent.</li><li><strong>Total order broadcast:</strong> All nodes deliver messages in the same order. Equivalent to consensus.</li></ul>'},
    {id:'ch10-s3',name:'Consensus Algorithms',content:'<p>Getting distributed nodes to agree on a value. Solved by:</p><ul><li><strong>Paxos:</strong> The original algorithm. Correct but complex to implement.</li><li><strong>Raft:</strong> Designed for understandability. Leader-based, used in etcd, CockroachDB.</li><li><strong>ZAB (ZooKeeper):</strong> Used by Apache ZooKeeper for coordination.</li></ul><p>Consensus is expensive — avoid it unless you need strong guarantees.</p>'},
    {id:'ch10-s4',name:'Distributed Transactions',content:'<ul><li><strong>Two-phase commit (2PC):</strong> Coordinator asks all nodes to prepare, then commit. Blocks if coordinator crashes.</li><li><strong>Three-phase commit:</strong> Adds a pre-commit phase. Doesn\'t block but can still fail.</li></ul><p>2PC is used by Spanner (with TrueTime to avoid blocking).</p>'}
  ],
  flashcards:[
    {q:'What is linearizability?',a:'Strongest consistency: system behaves as if one copy of data. Once a write is confirmed, all reads see it. Expensive — requires coordination.'},
    {q:'What is the CAP theorem?',a:'During a network partition: choose Consistency (linearizable, reject requests) or Availability (respond, may be stale). Can\'t have both during partition.'},
    {q:'Is Spanner CP or AP?',a:'CP — it chooses consistency over availability. During partitions, Spanner may reject requests rather than return stale data. TrueTime enables this globally.'},
    {q:'What is two-phase commit (2PC)?',a:'Step 1: Coordinator asks all nodes "can you commit?" Step 2: If all say yes, coordinator says "commit." Problem: blocks if coordinator crashes after Step 1.'},
    {q:'Raft vs Paxos?',a:'Both solve consensus. Raft is designed for understandability (leader-based, clear states). Paxos is the original, correct but notoriously hard to implement.'}
  ],
  quiz:[
    {q:'Your app needs absolute consistency globally. Users in Tokyo and NYC must never see different data. What do you sacrifice?',opts:['Nothing, modern systems do both','Availability during partitions','Latency only','Storage space'],correct:1,explain:'CAP theorem: linearizability (consistency) during partitions means rejecting some requests (sacrificing availability). Spanner does this — it may have higher latency or reject requests during network issues.'},
    {q:'A distributed transaction coordinator crashes after sending "prepare" but before sending "commit." What happens?',opts:['Transactions auto-commit','Transactions auto-abort','All participants are blocked waiting','System continues normally'],correct:2,explain:'This is the fundamental problem with 2PC. Participants are "in doubt" — they promised to commit but don\'t know if they should. They block until the coordinator recovers.'}
  ],
  palace:[
    {room:'Conference Room',desc:'Where everyone must agree',items:[{obj:'Single whiteboard everyone reads',concept:'Linearizability — one version of truth'},{obj:'Vote by raising hands',concept:'Consensus — all nodes agree on a value'},{obj:'Meeting blocked because boss is absent',concept:'2PC coordinator crash — everyone waits'}]}
  ],
  scenarios:[
    {context:'You\'re choosing between Spanner (CP) and a multi-region Cloud SQL setup (which is closer to AP with async replication) for a global banking app.',question:'Which do you choose and why?',answer:'Spanner (CP). Banking requires strong consistency — you cannot have two ATMs dispensing money from the same account simultaneously because one region has stale data. Spanner\'s TrueTime provides global serializability. The trade-off (slightly higher latency, possible rejection during partitions) is acceptable for financial correctness.'}
  ],
  gcpmap:[
    {concept:'Linearizability',service:'Spanner',why:'Globally linearizable using TrueTime'},
    {concept:'Eventual consistency',service:'Bigtable (cross-cluster), Cloud Storage',why:'Replicas converge over time'},
    {concept:'Consensus',service:'GKE (etcd uses Raft)',why:'Kubernetes stores cluster state via Raft consensus'},
    {concept:'2PC',service:'Spanner (internal)',why:'Global transactions use 2PC with TrueTime to avoid blocking'},
    {concept:'CAP trade-off',service:'Spanner (CP) vs Bigtable (AP)',why:'Spanner: consistency over availability. Bigtable: availability over consistency.'}
  ]
},

ch11:{title:'Ch 11: Batch Processing',
  summary:[
    {id:'ch11-s1',name:'Unix Philosophy and MapReduce',content:'<p>Batch processing takes a <strong>bounded dataset</strong>, processes it, and produces output. Like Unix pipes: <code>cat | grep | sort | uniq</code></p><h3>MapReduce</h3><ul><li><strong>Map:</strong> Extract key-value pairs from each record</li><li><strong>Shuffle:</strong> Group by key across nodes</li><li><strong>Reduce:</strong> Aggregate values for each key</li></ul><p>Simple model, but rigid. Many jobs need multiple MapReduce stages chained together.</p>'},
    {id:'ch11-s2',name:'Beyond MapReduce: Dataflow Engines',content:'<p>Modern batch engines (Spark, Flink, <strong>Apache Beam/Dataflow</strong>) improve on MapReduce:</p><ul><li><strong>Arbitrary DAGs:</strong> Not limited to map-then-reduce. Any graph of transformations.</li><li><strong>In-memory processing:</strong> Intermediate results stay in memory (no HDFS between stages).</li><li><strong>Optimized execution:</strong> Engine decides how to parallelize and pipeline operations.</li></ul>'},
    {id:'ch11-s3',name:'Joins in Batch Processing',content:'<ul><li><strong>Sort-merge join:</strong> Sort both datasets by key, merge. Used by MapReduce.</li><li><strong>Broadcast join:</strong> If one side is small, send it to all nodes. Avoid shuffle.</li><li><strong>Partitioned join:</strong> Both sides partitioned the same way. No network transfer needed.</li></ul><div class="tip"><div class="tip__label">GCP Connection</div><p>BigQuery automatically chooses join strategies. Dataflow/Beam uses CoGroupByKey (sort-merge) and side inputs (broadcast join).</p></div>'}
  ],
  flashcards:[
    {q:'MapReduce: Map, Shuffle, Reduce — what does each do?',a:'Map: extract key-value pairs. Shuffle: group by key across nodes (network transfer). Reduce: aggregate values per key.'},
    {q:'Why are Spark/Beam/Dataflow better than MapReduce?',a:'Arbitrary DAGs (not just map→reduce), in-memory processing (no disk between stages), optimized execution plans.'},
    {q:'What is a broadcast join?',a:'When one side of a join is small enough to fit in memory, send it to all worker nodes. Avoids expensive shuffle. In Beam: side inputs.'},
    {q:'What is the Unix philosophy connection to batch processing?',a:'Small tools chained via pipes: each does one thing well, passes output to the next. MapReduce is the same idea at massive scale.'}
  ],
  quiz:[
    {q:'You need to join a 10TB events table with a 50MB lookup table in Dataflow. Best approach?',opts:['Sort-merge join (CoGroupByKey)','Broadcast join (side input)','Hash join','Nested loop join'],correct:1,explain:'50MB fits in memory on every worker. Use a broadcast join (side input in Beam). Sending 50MB to all workers is much cheaper than shuffling 10TB.'},
    {q:'Why did the industry move from MapReduce to Spark/Beam?',opts:['MapReduce was too fast','MapReduce writes intermediate data to disk between stages','MapReduce doesn\'t support joins','Spark is free, MapReduce isn\'t'],correct:1,explain:'MapReduce writes intermediate results to HDFS between map and reduce stages. Spark/Beam keep data in memory, avoiding expensive disk I/O. Also, MapReduce is limited to map→reduce, while modern engines support arbitrary DAGs.'}
  ],
  palace:[
    {room:'Laundry Room',desc:'Batch processing = processing piles of things',items:[{obj:'Sort clothes by color (map)',concept:'Map phase — categorize each item'},{obj:'Group by color into piles (shuffle)',concept:'Shuffle — group by key across machines'},{obj:'Fold each pile (reduce)',concept:'Reduce — aggregate each group'},{obj:'Washing machine pipeline',concept:'DAG — modern engines chain operations without waiting'}]}
  ],
  scenarios:[
    {context:'You need to process 1TB of daily logs: parse, enrich with user data (100MB lookup table), aggregate by region, write to BigQuery.',question:'Design the Dataflow pipeline.',answer:'1) Read from GCS (bounded source). 2) Parse log lines (ParDo). 3) Enrich with user data via side input (broadcast join — 100MB fits in memory). 4) GroupByKey on region. 5) Combine to aggregate metrics. 6) Write to BigQuery. Use batch mode. Side input avoids shuffling the 1TB dataset.'}
  ],
  gcpmap:[
    {concept:'MapReduce',service:'Dataproc (Hadoop/Spark)',why:'Run existing MapReduce/Spark jobs on GCP'},
    {concept:'Modern batch engine',service:'Dataflow (Apache Beam)',why:'Arbitrary DAGs, in-memory, auto-scaling, serverless'},
    {concept:'Broadcast join',service:'Beam side inputs',why:'Small lookup table sent to all workers'},
    {concept:'Sort-merge join',service:'Beam CoGroupByKey',why:'Join two large datasets by key'},
    {concept:'Batch output',service:'BigQuery, GCS, Bigtable',why:'Write batch results to analytics or serving stores'}
  ]
},

ch12:{title:'Ch 12: Stream Processing',
  summary:[
    {id:'ch12-s1',name:'Streams vs Batch',content:'<table><thead><tr><th>Aspect</th><th>Batch</th><th>Stream</th></tr></thead><tbody><tr><td>Input</td><td>Bounded (finite dataset)</td><td>Unbounded (infinite events)</td></tr><tr><td>When</td><td>Periodically (hourly/daily)</td><td>Continuously</td></tr><tr><td>Latency</td><td>Minutes to hours</td><td>Seconds to milliseconds</td></tr><tr><td>Completeness</td><td>All data available</td><td>Events may arrive late</td></tr></tbody></table>'},
    {id:'ch12-s2',name:'Message Brokers',content:'<ul><li><strong>Log-based (Pub/Sub, Kafka):</strong> Durable, replayable, ordered within partitions. Consumers track their position (offset).</li><li><strong>Traditional (RabbitMQ):</strong> Message delivered to one consumer, acknowledged and deleted. No replay.</li></ul><div class="tip"><div class="tip__label">Key Insight</div><p>Pub/Sub is log-based. Messages persist for 7 days by default. You can replay from any point. This is crucial for reprocessing and recovery.</p></div>'},
    {id:'ch12-s3',name:'Stream Processing Patterns',content:'<ul><li><strong>Event time vs processing time:</strong> When the event happened vs when you process it. Always use event time for correct results.</li><li><strong>Windowing:</strong> Fixed, sliding, session windows to group events for aggregation.</li><li><strong>Watermarks:</strong> "I believe all events up to time T have arrived." Used to trigger window output.</li><li><strong>Late data:</strong> Events arriving after the watermark. Handle with allowed lateness.</li></ul>'},
    {id:'ch12-s4',name:'Stream-Table Duality',content:'<p>A stream is a log of changes. A table is the current state. They are duals:</p><ul><li><strong>Stream → Table:</strong> Apply all events in order = current state (event sourcing)</li><li><strong>Table → Stream:</strong> Capture every change as an event (CDC)</li></ul><p>This is the foundation of <strong>change data capture (CDC)</strong> and event sourcing architectures.</p>'}
  ],
  flashcards:[
    {q:'Event time vs processing time?',a:'Event time: when it actually happened (embedded in the event). Processing time: when the system processes it. Always use event time for correct results.'},
    {q:'What is a watermark?',a:'An assertion: "I believe all events up to time T have arrived." Triggers window output. Late events arrive after the watermark.'},
    {q:'Fixed vs sliding vs session windows?',a:'Fixed: non-overlapping time buckets (every 5 min). Sliding: overlapping (5 min window every 1 min). Session: gap-based (group by user activity with idle timeout).'},
    {q:'What is the stream-table duality?',a:'Stream = log of changes. Table = current state. Stream→Table: replay events to get state. Table→Stream: capture changes (CDC).'},
    {q:'Log-based vs traditional message broker?',a:'Log-based (Pub/Sub, Kafka): durable, replayable, ordered. Traditional (RabbitMQ): delivered once, deleted after ack, no replay.'},
    {q:'What is CDC (Change Data Capture)?',a:'Capturing every change to a database table as a stream of events. Table→Stream. Used to sync databases to data warehouses in real-time.'}
  ],
  quiz:[
    {q:'Your streaming pipeline aggregates clicks per minute. An event with timestamp 11:59 arrives at 12:03. What happens?',opts:['It\'s dropped','It\'s added to the 11:59 window (event time)','It\'s added to the 12:03 window (processing time)','Depends on watermark and allowed lateness'],correct:3,explain:'If the watermark has passed 11:59 and no allowed lateness is configured, the event is dropped. With allowed lateness, it can still be added to the correct window. Always configure allowed lateness for late data.'},
    {q:'You need to sync Cloud SQL changes to BigQuery in real-time. Best approach?',opts:['Nightly batch export','Pub/Sub + Dataflow','Direct BigQuery queries to Cloud SQL','Manual CSV dumps'],correct:1,explain:'CDC: capture changes from Cloud SQL as a stream (via Datastream or Debezium to Pub/Sub), process with Dataflow, write to BigQuery. Real-time sync with exactly-once semantics.'}
  ],
  palace:[
    {room:'River outside the house',desc:'Data flows continuously like a river',items:[{obj:'River flowing (never stops)',concept:'Unbounded stream — events never end'},{obj:'Dam with time gates',concept:'Windows — collect water for fixed periods'},{obj:'High-water mark on the dam',concept:'Watermark — how far behind we might be'},{obj:'Late rainfall after the dam opened',concept:'Late data — events arriving after watermark'}]}
  ],
  scenarios:[
    {context:'Vigil processes 45K security events/sec. You need real-time threat detection with 30-second aggregation windows. Some events arrive up to 5 minutes late due to network issues.',question:'Design the streaming architecture.',answer:'Pub/Sub (ingestion, durable, replayable) → Dataflow (processing): 1) Fixed windows of 30 seconds based on event time. 2) withAllowedLateness(5 minutes) for late events. 3) Accumulating mode to update previous results. 4) ParDo for threat detection logic. 5) Side output for alerts. → BigQuery (analytics) + Bigtable (real-time lookups).'}
  ],
  gcpmap:[
    {concept:'Log-based message broker',service:'Pub/Sub',why:'Durable, replayable, at-least-once, ordered within topic'},
    {concept:'Stream processing engine',service:'Dataflow (Apache Beam)',why:'Windowing, watermarks, exactly-once, unified batch+stream'},
    {concept:'Event time + watermarks',service:'Beam windowing API',why:'withTimestamps(), withAllowedLateness(), triggers'},
    {concept:'CDC (Change Data Capture)',service:'Datastream, Debezium + Pub/Sub',why:'Capture DB changes as streams for real-time sync'},
    {concept:'Stream → Table',service:'BigQuery streaming inserts',why:'Stream events directly into BigQuery tables'}
  ]
},

ch13:{title:'Ch 13: Doing the Right Thing',
  summary:[
    {id:'ch13-s1',name:'Ethics of Data Systems',content:'<p>As data engineers and architects, we build systems that affect people\'s lives. This chapter asks us to think about the ethical implications.</p><ul><li><strong>Surveillance:</strong> Data collection enables tracking people\'s behavior at scale</li><li><strong>Bias:</strong> ML models trained on biased data amplify discrimination</li><li><strong>Privacy:</strong> Users often don\'t understand what they consent to</li><li><strong>Power asymmetry:</strong> Companies know everything about users; users know nothing about the algorithms</li></ul>'},
    {id:'ch13-s2',name:'Privacy and Data Ownership',content:'<ul><li><strong>Data minimization:</strong> Collect only what you need</li><li><strong>Right to erasure:</strong> Users should be able to delete their data (GDPR/LGPD)</li><li><strong>Purpose limitation:</strong> Use data only for the stated purpose</li><li><strong>Transparency:</strong> Tell users what you collect and why</li></ul><div class="tip"><div class="tip__label">Your Experience</div><p>You managed GDPR-compliant pipelines at act digital. This chapter validates your experience — privacy is an architectural concern, not an afterthought.</p></div>'},
    {id:'ch13-s3',name:'Designing for Ethics',content:'<ul><li><strong>Privacy by design:</strong> Build privacy into the architecture from the start</li><li><strong>Audit trails:</strong> Know who accessed what data and when</li><li><strong>Differential privacy:</strong> Add noise to aggregates so individuals can\'t be identified</li><li><strong>Data deletion pipelines:</strong> When a user requests erasure, delete from ALL systems (source of truth, derived data, backups, caches)</li></ul>'}
  ],
  flashcards:[
    {q:'What is privacy by design?',a:'Build privacy into the architecture from the start, not as an afterthought. Minimize data collection, encrypt at rest, control access, support deletion.'},
    {q:'What is the right to erasure?',a:'GDPR/LGPD: users can request deletion of all their data. Architecture must support deleting from ALL systems — source of truth, derived data, backups, caches.'},
    {q:'What is differential privacy?',a:'Adding calibrated noise to aggregated data so individuals can\'t be identified, while preserving statistical accuracy. Protects privacy in analytics.'},
    {q:'Why is data deletion hard in distributed systems?',a:'Data is in multiple places: primary DB, replicas, BigQuery, caches, backups, logs, search indexes. Must delete from ALL of them. Need a deletion pipeline.'}
  ],
  quiz:[
    {q:'A user requests account deletion under GDPR. You delete from Cloud SQL. Is that enough?',opts:['Yes, Cloud SQL is the source of truth','No, must also delete from BigQuery, caches, backups, logs','Only if they signed a waiver','Depends on the country'],correct:1,explain:'GDPR requires deletion from ALL systems. Derived data in BigQuery, cached data in Memorystore, search indexes, log files, backups — all must be purged. This is why you need a data deletion pipeline.'}
  ],
  palace:[
    {room:'Front Garden',desc:'Where you face the outside world',items:[{obj:'Security camera (watching everything)',concept:'Surveillance — data collection at scale'},{obj:'Fence with a locked gate',concept:'Privacy — control who enters'},{obj:'Recycling bin',concept:'Right to erasure — ability to delete'},{obj:'Welcome mat with rules',concept:'Transparency — tell people the rules'}]}
  ],
  scenarios:[
    {context:'Your data platform stores user behavior data across Cloud SQL, BigQuery, Bigtable, and GCS logs. A user in Brazil requests deletion under LGPD.',question:'Design the deletion pipeline.',answer:'1) Receive deletion request via API. 2) Delete from Cloud SQL (source of truth) using DML DELETE. 3) Delete from BigQuery using DML DELETE by user_id. 4) Delete from Bigtable by scanning and deleting rows with user_id prefix. 5) Delete from GCS logs (harder — may need to rewrite files excluding the user). 6) Invalidate caches (Memorystore). 7) Log the deletion for audit trail. 8) Confirm to user within 30 days. Use DLP to find any remaining PII.'}
  ],
  gcpmap:[
    {concept:'Right to erasure',service:'BigQuery DML DELETE, Cloud SQL DELETE',why:'Record-level deletion for GDPR/LGPD compliance'},
    {concept:'Audit trail',service:'Cloud Audit Logs',why:'Track who accessed what data and when'},
    {concept:'PII detection',service:'DLP (Sensitive Data Protection)',why:'Find and classify personal data across all systems'},
    {concept:'Data minimization',service:'BigQuery column-level security, policy tags',why:'Restrict access to sensitive columns'},
    {concept:'Privacy by design',service:'VPC Service Controls + CMEK + DLP',why:'Defense in depth: perimeter + encryption + PII detection'}
  ]
}

};
