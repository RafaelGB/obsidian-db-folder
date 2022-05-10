import { DatabaseYaml } from "cdm/DatabaseModel";
import { DiskHandler, DiskHandlerResponse } from "cdm/MashallModel";
import { UnmarshallDatabaseInfoHandler } from "parsers/handlers/unmarshall/UnmarshallDatabaseInfoHandler";
import { UnmarshallColumnsHandler } from "parsers/handlers/unmarshall/UnmarshallColumnsHandler";
import { UnmarshallConfigHandler } from "parsers/handlers/unmarshall/UnmarshallConfigHandler";
import { UnmarshallFiltersHandler } from "parsers/handlers/unmarshall/UnmarshallFiltersHandler";

/**
 * PUBLIC METHODS
 *****************/
/**
 * Given a database config, obtain the string on yaml format
 * @param databaseConfig 
 */
const DatabaseYamlToStringParser = (databaseConfig: DatabaseYaml): string[] => {
  const response = persisDatabaseConfigOnDisk(databaseConfig);
  return response.disk;
}

/**
 * PRIVATE METHODS
 *****************/

/**
 * Validate yaml received from input using handlers of function getHandlers
 */
function persisDatabaseConfigOnDisk(databaseConfig: DatabaseYaml): DiskHandlerResponse {
  const handlers = getHandlers();
  let i = 1;
  while (i < handlers.length) {
    handlers[i - 1].setNext(handlers[i]);
    i++;
  }

  const response: DiskHandlerResponse = { yaml: databaseConfig, disk: [], errors: {} };
  return handlers[0].handle(response);
}


/**
 * Obtain all classes than extends from AbstractHandler
 */
function getHandlers(): DiskHandler[] {
  return [
    new UnmarshallDatabaseInfoHandler(),
    new UnmarshallColumnsHandler(),
    new UnmarshallConfigHandler(),
    new UnmarshallFiltersHandler()
  ];
}
export default DatabaseYamlToStringParser;