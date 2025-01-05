'use client';

import React, { useState } from 'react';
import { useCrewStore } from '../lib/store';

const Home: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [processType, setProcessType] = useState('sequential');
  const [showAdvanced, setShowAdvanced] = useState(false);

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
            memory: {
              type: "short_term",
              configuration: {
                max_messages: 50
              }
            },
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
            human_input: true,
            max_iterations: 5,
            max_rpm: 10,
            temperature: 0.7,
            is_hierarchical: true
          },
          {
            role: "Technical Writer",
            goal: "Create engaging and informative content from research findings",
            backstory: "Experienced technical writer specializing in making complex topics accessible",
            allow_delegation: false,
            verbose: true,
            memory: {
              type: "short_term",
              configuration: {
                max_messages: 30
              }
            },
            llm: "gpt-4-turbo-preview",
            human_input: true,
            max_iterations: 3,
            temperature: 0.7
          },
          {
            role: "Expert Reviewer",
            goal: "Review and validate technical content for accuracy and clarity",
            backstory: "Senior technical expert with a background in reviewing and validating technical documentation",
            allow_delegation: false,
            verbose: true,
            memory: {
              type: "short_term",
              configuration: {
                max_messages: 20
              }
            },
            llm: "gpt-4-turbo-preview",
            human_input: true,
            max_iterations: 2,
            temperature: 0.5
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
            human_validation: true,
            priority: 1,
            is_hierarchical: true,
            subtasks: [
              {
                description: "Identify top AI development tools",
                expected_output: "List of tools with descriptions",
                priority: 1
              },
              {
                description: "Analyze real-world applications",
                expected_output: "Case studies and examples",
                priority: 2
              }
            ]
          },
          {
            description: "Create a detailed technical blog post about the most promising AI development tools identified in the research. Include code examples and practical use cases.",
            agent_role: "Technical Writer",
            expected_output: "Well-structured technical blog post with examples",
            context: "Use the research findings to create content that developers can immediately apply",
            human_validation: true,
            priority: 2,
            dependencies: ["Research and analyze the latest developments"]
          },
          {
            description: "Review the technical blog post for accuracy, clarity, and completeness. Suggest improvements and validate technical claims.",
            agent_role: "Expert Reviewer",
            expected_output: "Detailed review with suggestions and validations",
            context: "Ensure all technical claims are accurate and examples are practical",
            human_validation: true,
            priority: 3,
            dependencies: ["Create a detailed technical blog post"]
          }
        ],
        process: processType,
        verbose: true,
        temperature: 0.7,
        cache: true,
        max_rpm: 10,
        config: {
          enableHumanValidation: true,
          maxRetries: 3,
          timeoutSeconds: 600,
          costLimit: null
        }
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
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            CrewAI Demo
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience the power of AI collaboration with our three-agent crew system
          </p>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Left Column - Configuration */}
          <div className="space-y-6">
            {/* Process Type Card */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-2xl font-semibold mb-6 flex items-center">
                <svg className="w-6 h-6 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Process Configuration
              </h2>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Process Type
                </label>
                <select
                  value={processType}
                  onChange={(e) => setProcessType(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="sequential">Sequential</option>
                  <option value="hierarchical">Hierarchical</option>
                  <option value="parallel">Parallel</option>
                </select>
                <p className="mt-2 text-sm text-gray-500">
                  {processType === 'sequential' && '⚡️ Tasks are executed in order, one after another'}
                  {processType === 'hierarchical' && '🌳 Tasks can have subtasks and dependencies'}
                  {processType === 'parallel' && '⚡️ Multiple tasks can run simultaneously'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center group"
              >
                <svg className={`w-4 h-4 mr-1 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                {showAdvanced ? 'Hide' : 'Show'} Advanced Settings
              </button>

              {showAdvanced && (
                <div className="mt-4 space-y-6 pt-4 border-t border-gray-100">
                  {/* Agent Memory */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                      <svg className="w-4 h-4 mr-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      Agent Memory
                    </h3>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between items-center">
                        <span>Research Analyst</span>
                        <span className="font-mono bg-blue-50 text-blue-700 px-2 py-1 rounded">50 msgs</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Technical Writer</span>
                        <span className="font-mono bg-blue-50 text-blue-700 px-2 py-1 rounded">30 msgs</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Expert Reviewer</span>
                        <span className="font-mono bg-blue-50 text-blue-700 px-2 py-1 rounded">20 msgs</span>
                      </div>
                    </div>
                  </div>

                  {/* Performance Settings */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                      <svg className="w-4 h-4 mr-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Performance Settings
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="bg-white p-3 rounded border border-gray-100">
                        <div className="text-gray-500">Max RPM</div>
                        <div className="font-semibold">10</div>
                      </div>
                      <div className="bg-white p-3 rounded border border-gray-100">
                        <div className="text-gray-500">Timeout</div>
                        <div className="font-semibold">600s</div>
                      </div>
                      <div className="bg-white p-3 rounded border border-gray-100">
                        <div className="text-gray-500">Max Retries</div>
                        <div className="font-semibold">3</div>
                      </div>
                      <div className="bg-white p-3 rounded border border-gray-100">
                        <div className="text-gray-500">Temperature</div>
                        <div className="font-semibold">0.7</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Agents & Tasks */}
          <div className="space-y-6">
            {/* Agents Card */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-2xl font-semibold mb-6 flex items-center">
                <svg className="w-6 h-6 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Crew Members
              </h2>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="font-semibold text-blue-900">Research Analyst</div>
                  <p className="text-sm text-blue-700 mt-1">Conducts thorough research with web search capability</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="font-semibold text-green-900">Technical Writer</div>
                  <p className="text-sm text-green-700 mt-1">Creates engaging technical content from research</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="font-semibold text-purple-900">Expert Reviewer</div>
                  <p className="text-sm text-purple-700 mt-1">Validates and improves the final content</p>
                </div>
              </div>
            </div>

            {/* Task Flow Card */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-2xl font-semibold mb-6 flex items-center">
                <svg className="w-6 h-6 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Task Flow
              </h2>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                <div className="space-y-6 relative">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">1</div>
                    <div className="ml-4">
                      <div className="font-medium">Research Phase</div>
                      <p className="text-sm text-gray-500 mt-1">Analyze AI development tools and trends</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">2</div>
                    <div className="ml-4">
                      <div className="font-medium">Content Creation</div>
                      <p className="text-sm text-gray-500 mt-1">Write technical blog post with examples</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">3</div>
                    <div className="ml-4">
                      <div className="font-medium">Expert Review</div>
                      <p className="text-sm text-gray-500 mt-1">Validate and improve content quality</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Section */}
        <div className="text-center">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="inline-flex items-center px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:-translate-y-0.5"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Running Crew...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Run Example Crew
              </>
            )}
          </button>
        </div>

        {/* Status Messages */}
        <div className="mt-8 space-y-4">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
              <div className="flex">
                <svg className="h-6 w-6 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h3 className="text-red-800 font-medium">Error Occurred</h3>
                  <p className="text-red-700 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          {loading && (
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
              <div className="flex">
                <svg className="animate-spin h-6 w-6 text-blue-500 mr-3" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <div>
                  <h3 className="text-blue-800 font-medium">Processing Request</h3>
                  <p className="text-blue-700 mt-1">The crew is working on your request. You will be prompted for input when needed.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Section */}
        {result && (
          <div className="mt-8">
            <div className="bg-white shadow-lg rounded-xl p-8 border border-gray-100">
              <h2 className="text-2xl font-semibold mb-6 flex items-center text-gray-900">
                <svg className="w-6 h-6 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Results
              </h2>
              <div className="prose prose-lg max-w-none">
                <pre className="bg-gray-50 rounded-lg p-4 overflow-x-auto">
                  <code className="text-sm text-gray-800">{result}</code>
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default Home; 