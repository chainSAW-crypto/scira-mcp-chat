"""
Research Agent Graph using LangGraph
"""
import asyncio
from typing import Dict, Any
from langgraph.graph import StateGraph, END
from state import OverallState, ResearchState


class ResearchAgent:
    """A simple research agent implementation"""
    
    def __init__(self):
        self.graph = self._create_graph()
    
    def _create_graph(self) -> StateGraph:
        """Create the research agent graph"""
        workflow = StateGraph(ResearchState)
        
        # Add nodes
        workflow.add_node("researcher", self._research_node)
        workflow.add_node("reflector", self._reflect_node)
        workflow.add_node("finalizer", self._finalize_node)
        
        # Set entry point
        workflow.set_entry_point("researcher")
        
        # Add edges
        workflow.add_edge("researcher", "reflector")
        workflow.add_conditional_edges(
            "reflector",
            self._should_continue,
            {
                "continue": "researcher",
                "end": "finalizer"
            }
        )
        workflow.add_edge("finalizer", END)
        
        return workflow.compile()
    
    async def _research_node(self, state: ResearchState) -> Dict[str, Any]:
        """Perform research step"""
        print(f"Research step {state['loop_count'] + 1} for question: {state['question']}")
        
        # Simulate research - in a real implementation, this would call search APIs
        query = f"Research query {state['loop_count'] + 1} for: {state['question']}"
        state["queries"].append(query)
        
        # Simulate finding sources
        source = f"https://example-source-{state['loop_count'] + 1}.com"
        state["sources"].append(source)
        
        # Simulate generating partial answer
        partial_answer = f"Research finding {state['loop_count'] + 1}: Information related to '{state['question']}'"
        if state["answer"]:
            state["answer"] += f"\n\n{partial_answer}"
        else:
            state["answer"] = partial_answer
        
        state["loop_count"] += 1
        
        return state
    
    async def _reflect_node(self, state: ResearchState) -> Dict[str, Any]:
        """Reflect on research quality"""
        reflection = f"Reflection after {state['loop_count']} research steps: "
        
        if state["loop_count"] >= state["max_loops"]:
            reflection += "Maximum loops reached. Research is complete."
            state["reflection"] = reflection
        elif len(state["sources"]) >= 2:
            reflection += "Sufficient sources found. Research quality is good."
            state["reflection"] = reflection
        else:
            reflection += "Need more research to improve answer quality."
            state["reflection"] = reflection
        
        return state
    
    def _should_continue(self, state: ResearchState) -> str:
        """Decide whether to continue research or end"""
        if state["loop_count"] >= state["max_loops"]:
            return "end"
        elif len(state["sources"]) >= 3:  # Enough sources
            return "end"
        else:
            return "continue"
    
    async def _finalize_node(self, state: ResearchState) -> Dict[str, Any]:
        """Finalize the research"""
        # Enhance the final answer
        final_answer = f"Research Summary for: {state['question']}\n\n"
        final_answer += state["answer"]
        final_answer += f"\n\nSources consulted: {len(state['sources'])}"
        final_answer += f"\nResearch iterations: {state['loop_count']}"
        
        state["answer"] = final_answer
        return state
    
    async def ainvoke(self, initial_state: OverallState, config: Dict[str, Any] = None) -> Dict[str, Any]:
        """Invoke the research agent"""
        # Convert OverallState to ResearchState dict
        state_dict: ResearchState = {
            "question": initial_state.question,
            "max_loops": initial_state.max_loops,
            "loop_count": initial_state.loop_count,
            "sources": initial_state.sources.copy(),
            "answer": initial_state.answer,
            "reflection": initial_state.reflection,
            "queries": initial_state.queries.copy()
        }
        
        try:
            # Run the graph
            result = await self.graph.ainvoke(state_dict, config=config or {})
            return result
        except Exception as e:
            print(f"Error in research agent: {e}")
            # Return error state
            return {
                "question": initial_state.question,
                "answer": f"Error occurred during research: {str(e)}",
                "sources": initial_state.sources,
                "reflection": f"Research failed due to error: {str(e)}",
                "queries": initial_state.queries,
                "loop_count": initial_state.loop_count,
                "max_loops": initial_state.max_loops
            }


# Create the global graph instance
research_agent = ResearchAgent()
graph = research_agent
