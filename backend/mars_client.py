import os
import asyncio
from langgraph_sdk import get_client
from tenacity import retry, stop_after_attempt, wait_fixed, RetryError
import logging

# Set up logging
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

# Initialize LangGraph client
client = get_client(
    url="https://ht-vacant-providence-60-b70b203b735b596eac574071f7251ad0.us.langgraph.app",
    api_key=os.getenv("LANGGRAPH_API_KEY"),
)


@retry(stop=stop_after_attempt(3), wait=wait_fixed(2))
async def run_mars_insights(payload: dict):
    try:
        logger.info("Starting new MARS thread...")
        thread = await client.threads.create()
        graph_name = "advisor"

        logger.info("Running graph with payload: %s", payload)
        run = await client.runs.create(
            thread["thread_id"],
            graph_name,
            input=payload,
        )

        logger.info("Waiting for run to complete...")
        result = await client.runs.join(thread["thread_id"], run["run_id"])

        # logger.info("Fetching final result...")
        # result = await client.runs.get(thread["thread_id"], run["run_id"])

        logger.info("Successfully got MARS result.")
        return result

    except Exception as e:
        logger.error("Error running MARS insights: %s", str(e))
        raise


