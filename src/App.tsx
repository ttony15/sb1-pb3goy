import React, { useState, useEffect } from 'react';
import { Calculator, ChevronDown, ChevronUp, HelpCircle, LogIn, LogOut } from 'lucide-react';

// In a real app, this would be stored securely on the server
const ADMIN_PASSWORD = 'ZachMan1533@gmail.com';

const TOTAL_ENKI_AIRDROP = 400000; // 400,000 ENKI

function App() {
  const [stakingPoints, setStakingPoints] = useState<string>('');
  const [estimatedReward, setEstimatedReward] = useState<number | null>(null);
  const [showCalculations, setShowCalculations] = useState(false);
  const [enkiPrice, setEnkiPrice] = useState<number | null>(null);
  const [totalStakingPoints, setTotalStakingPoints] = useState<number>(2.68e9);
  const [showGuide, setShowGuide] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEnkiPrice();
  }, []);

  const fetchEnkiPrice = async () => {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=enki-protocol&vs_currencies=usd');
      const data = await response.json();
      setEnkiPrice(data['enki-protocol'].usd);
    } catch (error) {
      console.error('Error fetching ENKI price:', error);
    }
  };

  const calculateReward = (points: number) => {
    return (points / totalStakingPoints) * TOTAL_ENKI_AIRDROP;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const points = parseFloat(stakingPoints);
    if (!isNaN(points) && points > 0) {
      setEstimatedReward(calculateReward(points));
    } else {
      setEstimatedReward(null);
    }
  };

  const handleAdminLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (adminPassword === ADMIN_PASSWORD) {
      setIsAdmin(true);
      setAdminPassword('');
      setShowAdminLogin(false);
      setError(null);
    } else {
      setError('Invalid password');
    }
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
  };

  const handleUpdateTotalStakingPoints = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const newTotalStakingPoints = parseFloat(form.totalStakingPoints.value);
    if (!isNaN(newTotalStakingPoints) && newTotalStakingPoints > 0) {
      setTotalStakingPoints(newTotalStakingPoints);
      setError(null);
    } else {
      setError('Invalid total staking points');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-500 flex items-center justify-center p-4">
      <div className="bg-yellow-50 rounded-lg shadow-xl p-8 w-full max-w-4xl">
        <div className="flex flex-col items-center justify-center mb-6">
          <h1 className="text-4xl font-bold text-yellow-800 text-center mb-2">ENKI Staking Rewards Calculator</h1>
          <p className="text-yellow-600 text-center">Estimate your ENKI airdrop rewards based on your staking points</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="stakingPoints" className="block text-sm font-medium text-yellow-700 mb-1">
              Your Staking Points
            </label>
            <div className="relative">
              <input
                type="number"
                id="stakingPoints"
                value={stakingPoints}
                onChange={(e) => setStakingPoints(e.target.value)}
                className="w-full px-3 py-2 border border-yellow-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-yellow-100"
                placeholder="Enter your staking points"
                required
              />
              <button
                type="button"
                onClick={() => setShowGuide(!showGuide)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-yellow-600 hover:text-yellow-700"
              >
                <HelpCircle className="w-5 h-5" />
              </button>
            </div>
          </div>
          {showGuide && (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-4">
              <h4 className="text-lg font-semibold text-yellow-800 mb-2">How to find your staking points:</h4>
              <ol className="list-decimal list-inside text-yellow-700">
                <li>Go to <a href="https://www.enkixyz.com/portfolio" target="_blank" rel="noopener noreferrer" className="text-yellow-600 hover:underline">https://www.enkixyz.com/portfolio</a></li>
                <li>Connect your wallet</li>
                <li>Find your staking points under "Staking Rewards"</li>
              </ol>
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-yellow-600 text-white py-2 px-4 rounded-md hover:bg-yellow-700 transition duration-300 flex items-center justify-center"
          >
            <Calculator className="w-5 h-5 mr-2" />
            Calculate Reward
          </button>
        </form>
        <div className="mt-6 space-y-2">
          <p className="text-sm text-yellow-700">
            Total Staking Points: <span className="font-semibold">{totalStakingPoints.toLocaleString()} ~</span>
          </p>
          <p className="text-sm text-yellow-700">
            Total ENKI Airdrop: <span className="font-semibold">{TOTAL_ENKI_AIRDROP.toLocaleString()} ENKI</span>
          </p>
          {enkiPrice !== null && (
            <p className="text-sm text-yellow-700">
              Current ENKI Price: <span className="font-semibold">${enkiPrice.toFixed(4)} USD</span>
            </p>
          )}
          {estimatedReward !== null && (
            <div className="bg-yellow-200 border-l-4 border-yellow-500 p-4 mt-4">
              <p className="text-yellow-800">
                Estimated Reward: <span className="font-bold">{estimatedReward.toFixed(2)} ENKI</span>
              </p>
              {enkiPrice !== null && (
                <p className="text-yellow-800 mt-2">
                  Estimated Value: <span className="font-bold">${(estimatedReward * enkiPrice).toFixed(2)} USD</span>
                </p>
              )}
            </div>
          )}
          <button
            onClick={() => setShowCalculations(!showCalculations)}
            className="flex items-center text-yellow-600 hover:text-yellow-700 transition duration-300 mt-4"
          >
            {showCalculations ? <ChevronUp className="w-4 h-4 mr-1" /> : <ChevronDown className="w-4 h-4 mr-1" />}
            {showCalculations ? 'Hide Calculations' : 'Show Calculations'}
          </button>
          {showCalculations && estimatedReward !== null && (
            <div className="bg-yellow-100 p-4 rounded-md mt-2">
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">Calculation Breakdown</h3>
              <p className="text-sm text-yellow-700 mb-1">
                Your Staking Points: {parseFloat(stakingPoints).toLocaleString()}
              </p>
              <p className="text-sm text-yellow-700 mb-1">
                Total Staking Points: {totalStakingPoints.toLocaleString()}
              </p>
              <p className="text-sm text-yellow-700 mb-1">
                Total ENKI Airdrop: {TOTAL_ENKI_AIRDROP.toLocaleString()} ENKI
              </p>
              <p className="text-sm text-yellow-700 mb-1">
                Formula: (Your Staking Points / Total Staking Points) × Total ENKI Airdrop
              </p>
              <p className="text-sm text-yellow-700">
                Calculation: ({parseFloat(stakingPoints).toLocaleString()} / {totalStakingPoints.toLocaleString()}) × {TOTAL_ENKI_AIRDROP.toLocaleString()} = {estimatedReward.toFixed(2)} ENKI
              </p>
              {enkiPrice !== null && (
                <p className="text-sm text-yellow-700 mt-1">
                  USD Value: {estimatedReward.toFixed(2)} ENKI × ${enkiPrice.toFixed(4)} = ${(estimatedReward * enkiPrice).toFixed(2)} USD
                </p>
              )}
            </div>
          )}
        </div>

        <div className="mt-8 text-right">
          {!isAdmin && (
            <button
              onClick={() => setShowAdminLogin(!showAdminLogin)}
              className="text-xs text-yellow-600 hover:text-yellow-700 underline"
            >
              Admin Login
            </button>
          )}
          {showAdminLogin && (
            <form onSubmit={handleAdminLogin} className="mt-2 flex justify-end items-center space-x-2">
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Admin Password"
                className="px-2 py-1 text-sm border border-yellow-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-yellow-100"
              />
              <button
                type="submit"
                className="bg-yellow-600 text-white py-1 px-2 rounded-md hover:bg-yellow-700 transition duration-300 flex items-center justify-center text-sm"
              >
                <LogIn className="w-4 h-4 mr-1" />
                Login
              </button>
            </form>
          )}
          {isAdmin && (
            <div className="mt-4 space-y-4">
              <form onSubmit={handleUpdateTotalStakingPoints} className="space-y-2">
                <div>
                  <label htmlFor="totalStakingPoints" className="block text-sm font-medium text-yellow-700 mb-1">
                    Update Total Staking Points
                  </label>
                  <input
                    type="number"
                    id="totalStakingPoints"
                    name="totalStakingPoints"
                    defaultValue={totalStakingPoints}
                    className="w-full px-3 py-2 border border-yellow-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-yellow-100"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-yellow-600 text-white py-2 px-4 rounded-md hover:bg-yellow-700 transition duration-300"
                >
                  Update Total Staking Points
                </button>
              </form>
              <button
                onClick={handleAdminLogout}
                className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition duration-300 flex items-center justify-center"
              >
                <LogOut className="w-5 h-5 mr-2" />
                Logout
              </button>
            </div>
          )}
          {error && (
            <div className="mt-2 text-red-600 text-sm">{error}</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;