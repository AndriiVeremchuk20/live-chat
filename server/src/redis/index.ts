import {createClient} from "redis";
import logger from "../logger";

const redisClient = createClient();

redisClient.on("error", err=>logger.error("Redis client error", err));

export default redisClient;
