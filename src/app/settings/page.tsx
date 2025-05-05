import React from 'react';
import SettingsForm from './components/SettingsForm';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Account Settings</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1 px-6 py-5 bg-gray-50 dark:bg-gray-750 md:rounded-l-lg">
            <div className="space-y-1">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Profile</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Update your personal information and profile picture.
              </p>
            </div>
          </div>
          <div className="md:col-span-2 p-6">
            <div className="flex items-center space-x-5">
              <div className="flex-shrink-0">
                <div className="h-24 w-24 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-4xl text-gray-700 dark:text-gray-300 font-medium">
                  J
                </div>
              </div>
              <div>
                <div className="text-xl font-medium text-gray-900 dark:text-white">John Doe</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">john.doe@example.com</div>
                <button className="mt-2 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Change Photo
                </button>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="first-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  First name
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="first-name"
                    id="first-name"
                    autoComplete="given-name"
                    defaultValue="John"
                    className="bg-gray-100 dark:bg-gray-700 border-transparent rounded-lg px-4 py-2 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent block w-full"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="last-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Last name
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="last-name"
                    id="last-name"
                    autoComplete="family-name"
                    defaultValue="Doe"
                    className="bg-gray-100 dark:bg-gray-700 border-transparent rounded-lg px-4 py-2 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent block w-full"
                  />
                </div>
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    defaultValue="john.doe@example.com"
                    className="bg-gray-100 dark:bg-gray-700 border-transparent rounded-lg px-4 py-2 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent block w-full"
                  />
                </div>
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Phone number
                </label>
                <div className="mt-1">
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    defaultValue="+1 (555) 123-4567"
                    className="bg-gray-100 dark:bg-gray-700 border-transparent rounded-lg px-4 py-2 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent block w-full"
                  />
                </div>
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Country
                </label>
                <div className="mt-1">
                  <select
                    id="country"
                    name="country"
                    autoComplete="country-name"
                    className="bg-gray-100 dark:bg-gray-700 border-transparent rounded-lg px-4 py-2 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent block w-full"
                  >
                    <option>United States</option>
                    <option>Canada</option>
                    <option>United Kingdom</option>
                    <option>Australia</option>
                    <option>Germany</option>
                    <option>Japan</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1 px-6 py-5 bg-gray-50 dark:bg-gray-750 md:rounded-l-lg">
            <div className="space-y-1">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Security</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Manage your password and security settings.
              </p>
            </div>
          </div>
          <div className="md:col-span-2 p-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-6">
                <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Current password
                </label>
                <div className="mt-1">
                  <input
                    id="current-password"
                    name="current-password"
                    type="password"
                    autoComplete="current-password"
                    className="bg-gray-100 dark:bg-gray-700 border-transparent rounded-lg px-4 py-2 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent block w-full"
                  />
                </div>
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  New password
                </label>
                <div className="mt-1">
                  <input
                    id="new-password"
                    name="new-password"
                    type="password"
                    autoComplete="new-password"
                    className="bg-gray-100 dark:bg-gray-700 border-transparent rounded-lg px-4 py-2 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent block w-full"
                  />
                </div>
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Confirm password
                </label>
                <div className="mt-1">
                  <input
                    id="confirm-password"
                    name="confirm-password"
                    type="password"
                    autoComplete="new-password"
                    className="bg-gray-100 dark:bg-gray-700 border-transparent rounded-lg px-4 py-2 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent block w-full"
                  />
                </div>
              </div>

              <div className="sm:col-span-6">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Two-factor authentication</h4>
                <div className="flex items-center">
                  <div className="h-5 w-5 bg-green-500 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Enabled</span>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Authentication app (Google Authenticator)</p>
                  </div>
                  <button className="ml-auto px-3 py-1.5 text-xs bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                    Disable
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1 px-6 py-5 bg-gray-50 dark:bg-gray-750 md:rounded-l-lg">
            <div className="space-y-1">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Notifications</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Configure your notification preferences.
              </p>
            </div>
          </div>
          <div className="md:col-span-2 p-6">
            <div className="space-y-6">
              <fieldset>
                <legend className="text-base font-medium text-gray-900 dark:text-white">Email Notifications</legend>
                <div className="mt-4 space-y-4">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="email-market"
                        name="email-market"
                        type="checkbox"
                        defaultChecked
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="email-market" className="font-medium text-gray-700 dark:text-gray-300">Market updates</label>
                      <p className="text-gray-500 dark:text-gray-400">Get notified about significant market movements and price alerts.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="email-wallet"
                        name="email-wallet"
                        type="checkbox"
                        defaultChecked
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="email-wallet" className="font-medium text-gray-700 dark:text-gray-300">Wallet activity</label>
                      <p className="text-gray-500 dark:text-gray-400">Receive emails for deposits, withdrawals, and other wallet activities.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="email-news"
                        name="email-news"
                        type="checkbox"
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="email-news" className="font-medium text-gray-700 dark:text-gray-300">News and updates</label>
                      <p className="text-gray-500 dark:text-gray-400">Get the latest news, product updates, and promotions.</p>
                    </div>
                  </div>
                </div>
              </fieldset>
              
              <fieldset>
                <legend className="text-base font-medium text-gray-900 dark:text-white">Push Notifications</legend>
                <div className="mt-4 space-y-4">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="push-market"
                        name="push-market"
                        type="checkbox"
                        defaultChecked
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="push-market" className="font-medium text-gray-700 dark:text-gray-300">Price alerts</label>
                      <p className="text-gray-500 dark:text-gray-400">Receive push notifications for your set price alerts.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="push-security"
                        name="push-security"
                        type="checkbox"
                        defaultChecked
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="push-security" className="font-medium text-gray-700 dark:text-gray-300">Security alerts</label>
                      <p className="text-gray-500 dark:text-gray-400">Get notified about login attempts and account changes.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="push-transaction"
                        name="push-transaction"
                        type="checkbox"
                        defaultChecked
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="push-transaction" className="font-medium text-gray-700 dark:text-gray-300">Transaction updates</label>
                      <p className="text-gray-500 dark:text-gray-400">Receive notifications when transactions are completed.</p>
                    </div>
                  </div>
                </div>
              </fieldset>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1 px-6 py-5 bg-gray-50 dark:bg-gray-750 md:rounded-l-lg">
            <div className="space-y-1">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">API Access</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Manage your API keys and access tokens.
              </p>
            </div>
          </div>
          <div className="md:col-span-2 p-6">
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">API Keys</h4>
                <div className="bg-gray-50 dark:bg-gray-750 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Trading API Key</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Created on May 1, 2025</div>
                    </div>
                    <div className="space-x-2">
                      <button className="px-3 py-1.5 text-xs bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">
                        View
                      </button>
                      <button className="px-3 py-1.5 text-xs bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                        Revoke
                      </button>
                    </div>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      value="••••••••••••••••••••••••••••••"
                      readOnly
                      className="bg-white dark:bg-gray-700 border-transparent rounded-lg px-4 py-2 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent block w-full"
                    />
                    <button className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 text-xs bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">
                      Copy
                    </button>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Webhooks</h4>
                <div className="bg-gray-50 dark:bg-gray-750 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Transaction Webhook</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">https://example.com/webhook/crypto</div>
                    </div>
                    <div className="space-x-2">
                      <button className="px-3 py-1.5 text-xs bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">
                        Edit
                      </button>
                      <button className="px-3 py-1.5 text-xs bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
                
                <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                  Add New Webhook
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end space-x-4">
        <button className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
          Cancel
        </button>
        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Save Changes
        </button>
      </div>
    </div>
  );
}
