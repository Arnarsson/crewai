'use client';

import React, { useState } from 'react';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    
    try {
      const exampleCrew = {
        agents: [
          {
            role: "Research Analyst",
            goal: "Conduct thorough research and analysis on emerging technologies",
            backstory: "Senior technology analyst with expertise in identifying and evaluating emerging tech trends",
            allow_delegation: true,
            verbose: true,
            memory: true,
            llm: "gpt-4-turbo-preview",
            tools: [
              {
                name: "web_search",
                tool_type: "search",
                description: "Search the web for current information"
              },
              {
                name: "calculator",
                tool_type: "calculator",
                description: "Perform numerical calculations"
              }
            ],
            human_input: true
          },
          {
            role: "Technical Writer",
            goal: "Create engaging and informative content from research findings",
            backstory: "Experienced technical writer specializing in making complex topics accessible",
            allow_delegation: false,
            verbose: true,
            memory: true,
            llm: "gpt-4-turbo-preview",
            human_input: true
          },
          {
            role: "Expert Reviewer",
            goal: "Review and validate technical content for accuracy and clarity",
            backstory: "Senior technical expert with a background in reviewing and validating technical documentation",
            allow_delegation: false,
            verbose: true,
            memory: true,
            llm: "gpt-4-turbo-preview",
            human_input: true
          }
        ],
        tasks: [
          {
            description: "Research and analyze the latest developments in AI-driven software development tools and practices. Focus on real-world applications and emerging trends.",
            agent_role: "Research Analyst",
            expected_output: "Comprehensive research report on AI-driven development tools and practices",
            tools: [
              {
                name: "web_search",
                tool_type: "search"
              }
            ],
            context: "Focus on practical applications and tools that are currently available or in late-stage development",
            human_validation: true
          },
          {
            description: "Create a detailed technical blog post about the most promising AI development tools identified in the research. Include code examples and practical use cases.",
            agent_role: "Technical Writer",
            expected_output: "Well-structured technical blog post with examples",
            context: "Use the research findings to create content that developers can immediately apply",
            human_validation: true
          },
          {
            description: "Review the technical blog post for accuracy, clarity, and completeness. Suggest improvements and validate technical claims.",
            agent_role: "Expert Reviewer",
            expected_output: "Detailed review with suggestions and validations",
            context: "Ensure all technical claims are accurate and examples are practical",
            human_validation: true
          }
        ],
        process: "sequential",
        verbose: true,
        temperature: 0.7,
        cache: true,
        max_rpm: 10
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/crews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(exampleCrew),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.detail || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      
      // Extract and format the result text
      let resultText = '';
      if (data.result?.tasks_output?.length > 0) {
        resultText = data.result.tasks_output
          .map((task: any, index: number) => {
            const taskNum = index + 1;
            return `Task ${taskNum} Output:\n${task.raw || task.output || JSON.stringify(task, null, 2)}`;
          })
          .join('\n\n---\n\n');
      } else if (data.result?.raw) {
        resultText = data.result.raw;
      } else if (data.result?.output) {
        resultText = data.result.output;
      } else {
        resultText = JSON.stringify(data.result, null, 2);
      }

      setResult(resultText);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An error occurred');
      console.error('Error:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-gray-900">CrewAI Demo</h1>
        
        <div className="mb-8">
          <p className="text-gray-600 mb-4">
            This demo showcases a three-agent crew that will:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li>Research the latest AI development tools (with web search capability)</li>
            <li>Create a technical blog post about the findings</li>
            <li>Review and validate the content</li>
          </ul>
          <p className="text-gray-600 mb-4">
            The process includes human-in-the-loop validation at each step.
            This may take several minutes to complete.
          </p>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium disabled:bg-gray-400 transition-colors"
          >
            {loading ? 'Running Crew...' : 'Run Example Crew'}
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
            <p className="font-medium">Error:</p>
            <p>{error}</p>
          </div>
        )}

        {loading && (
          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded-lg mb-4">
            <p>The crew is working on your request. This may take a few minutes...</p>
            <p className="mt-2 text-sm">You will be prompted for input when needed.</p>
          </div>
        )}

        {result && (
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">Result:</h2>
            <div className="prose prose-lg max-w-none whitespace-pre-wrap text-gray-700">
              {result}
            </div>
          </div>
        )}
      </div>
    </main>
  );
} 