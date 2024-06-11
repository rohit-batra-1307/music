import neo4j from 'neo4j-driver';

const NEO4J_URI = process.env.NEO4J_URI || 'neo4j+s://10a90882.databases.neo4j.io';
const NEO4J_USER = process.env.NEO4J_USER || 'neo4j';
const NEO4J_PASSWORD = process.env.NEO4J_PASSWORD || 'Ay56y4OUQMeEbERPmqbgoHOfRi74lg5CEWXgtu5SZuk';

const driver = neo4j.driver(NEO4J_URI, neo4j.auth.basic(NEO4J_USER, NEO4J_PASSWORD));

const createSession = () => driver.session();   
export {driver, createSession}
