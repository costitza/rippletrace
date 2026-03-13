MATCH (a:Entity {{name: $source}}), (b:Entity {{name: $target}}) 
MERGE (a)-[r:`{rel_type}`]->(b)
