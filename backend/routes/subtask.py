from fastapi import APIRouter, Depends, HTTPException
from models import Subtasks
from database import get_session
from sqlmodel import Session, select

router = APIRouter(prefix="/subtasks", tags=["subtasks"])

@router.post("/")
def create_subtask(subtask: Subtasks, session: Session = Depends(get_session)):
    session.add(subtask)
    session.commit()
    session.refresh(subtask)
    return subtask