export function QuickTips() {
  return (
    <div className="mt-6 bg-gradient-to-br from-purple-900/30 to-indigo-900/30 backdrop-blur-sm rounded-xl p-6 border border-purple-800/30">
      <h4 className="font-semibold text-purple-200 mb-3">Quick Tips</h4>
      <ul className="space-y-2 text-sm text-purple-300">
        <li className="flex items-start">
          <svg
            className="w-4 h-4 mr-2 mt-0.5 text-purple-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          Share room codes with collaborators
        </li>
        <li className="flex items-start">
          <svg
            className="w-4 h-4 mr-2 mt-0.5 text-purple-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          All changes are saved automatically
        </li>
        <li className="flex items-start">
          <svg
            className="w-4 h-4 mr-2 mt-0.5 text-purple-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          Use keyboard shortcuts for faster drawing
        </li>
      </ul>
    </div>
  );
}
