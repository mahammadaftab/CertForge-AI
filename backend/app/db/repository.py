from typing import List, Type, TypeVar, Optional, Generic
from beanie import Document, PydanticObjectId
from pydantic import BaseModel

T = TypeVar("T", bound=Document)

class BaseRepository(Generic[T]):
    def __init__(self, model: Type[T]):
        self.model = model

    async def create(self, document: T) -> T:
        return await document.insert()

    async def get(self, id: str) -> Optional[T]:
        return await self.model.get(PydanticObjectId(id))

    async def get_all(self) -> List[T]:
        return await self.model.find_all().to_list()

    async def update(self, id: str, update_data: dict) -> Optional[T]:
        doc = await self.get(id)
        if doc:
            await doc.update({"$set": update_data})
            return doc
        return None

    async def delete(self, id: str) -> bool:
        doc = await self.get(id)
        if doc:
            await doc.delete()
            return True
        return False

    async def find_one(self, query: dict) -> Optional[T]:
        return await self.model.find_one(query)

    async def find_many(self, query: dict) -> List[T]:
        return await self.model.find(query).to_list()
