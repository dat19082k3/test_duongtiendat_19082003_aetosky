from sqlalchemy import Column, String, DateTime
from database import Base
import datetime

class Job(Base):
    __tablename__ = "jobs"

    id = Column(String, primary_key=True, index=True)
    status = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), default=datetime.datetime.utcnow)
    finished_at = Column(DateTime(timezone=True), nullable=True)
    last_error = Column(String, nullable=True)
