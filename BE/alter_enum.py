import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text
from app.core.config import settings

async def alter_enum():
    engine = create_async_engine(settings.DATABASE_URL)
    async with engine.begin() as conn:
        try:
            await conn.execute(text("ALTER TYPE post_type ADD VALUE 'general'"))
            print('Enum altered successfully!')
        except Exception as e:
            print('Error altering enum (might already exist):', e)
    await engine.dispose()

asyncio.run(alter_enum())
