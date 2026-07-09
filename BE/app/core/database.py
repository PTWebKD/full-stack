from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import DeclarativeBase
from .config import settings

engine = create_async_engine(settings.async_database_url, echo=False, pool_pre_ping=True)
AsyncSessionLocal = async_sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)


from sqlalchemy import event
import sqlite3
import datetime

@event.listens_for(engine.sync_engine, "connect")
def set_sqlite_pragma(dbapi_connection, connection_record):
    if hasattr(dbapi_connection, "create_function"):
        # Register dummy setval function (takes 2 or 3 args)
        dbapi_connection.create_function("setval", 2, lambda *args: 0)
        dbapi_connection.create_function("setval", 3, lambda *args: 0)
        # Register NOW function (takes 0 args, returns current time)
        dbapi_connection.create_function("NOW", 0, lambda: datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"))



class Base(DeclarativeBase):
    pass


async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
