import { useState, useEffect } from "react";
import initialTokens from "../data/tokens.json";

type Token = {
  id: string;
  category: string;
  name: string;
  value: string;
  description: string;
  updated_at: string;
};

export default function TokenManager() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [activeTab, setActiveTab] = useState<string>("color");

  useEffect(() => {
    const saved = localStorage.getItem("pds_tokens");
    if (saved) {
      setTokens(JSON.parse(saved));
    } else {
      setTokens(initialTokens);
      localStorage.setItem("pds_tokens", JSON.stringify(initialTokens));
    }
  }, []);

  const categories = ["color", "typography", "spacing", "radius", "shadow"];
  const filteredTokens = tokens.filter(t => t.category === activeTab);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Token Manager</h1>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
          + Add Token
        </button>
      </div>

      <div className="flex gap-4 border-b border-gray-200 mb-8 overflow-x-auto">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={`pb-4 px-4 font-medium capitalize border-b-2 transition-colors whitespace-nowrap ${
              activeTab === cat 
                ? "border-blue-600 text-blue-600" 
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="p-4 font-semibold text-gray-600">Name</th>
              <th className="p-4 font-semibold text-gray-600">Value</th>
              <th className="p-4 font-semibold text-gray-600 hidden md:table-cell">Description</th>
              <th className="p-4 font-semibold text-gray-600 w-24">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredTokens.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-500">
                  No tokens found for this category.
                </td>
              </tr>
            ) : (
              filteredTokens.map(token => (
                <tr key={token.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-medium text-gray-800">{token.name}</td>
                  <td className="p-4 font-mono text-sm text-gray-600 flex items-center gap-3">
                    {token.category === "color" && (
                      <span 
                        className="w-6 h-6 rounded border border-gray-200 shrink-0" 
                        style={{ backgroundColor: token.value }}
                      ></span>
                    )}
                    {token.category === "shadow" && (
                      <div 
                        className="w-6 h-6 rounded bg-white border border-gray-200 shrink-0" 
                        style={{ boxShadow: token.value }}
                      ></div>
                    )}
                    {token.value}
                  </td>
                  <td className="p-4 text-gray-500 hidden md:table-cell">{token.description}</td>
                  <td className="p-4">
                    <button className="text-blue-600 hover:underline text-sm font-medium mr-3">Edit</button>
                    <button className="text-red-500 hover:underline text-sm font-medium">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
