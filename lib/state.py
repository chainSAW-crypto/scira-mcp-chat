from typing import List, Optional
from dataclasses import dataclass
from typing_extensions import TypedDict


@dataclass
class OverallState:
    """State for the research agent"""
    question: str
    max_loops: int = 3
    loop_count: int = 0
    sources: List[str] = None
    answer: str = ""
    reflection: str = ""
    queries: List[str] = None
    
    def __post_init__(self):
        if self.sources is None:
            self.sources = []
        if self.queries is None:
            self.queries = []


class ResearchState(TypedDict):
    """TypedDict version of the research state for LangGraph compatibility"""
    question: str
    max_loops: int
    loop_count: int
    sources: List[str]
    answer: str
    reflection: str
    queries: List[str]
