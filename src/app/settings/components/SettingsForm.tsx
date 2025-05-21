"use client";

import React, { useState } from 'react';

interface SettingsFormProps {
  // You can add specific props as needed
}

export default function SettingsForm({}: SettingsFormProps) {
  // State for form values
  const [formData, setFormData] = useState({
    darkMode: true,
    language: 'en',
    currency: 'USD',
    tradingView: true,
    notifications: {
      email: true,
      push: true,
      sms: false
    },
    security: {
      twoFactor: true,
      loginNotifications: true
    }
  });
  
  // Handle form changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      
      if (name.includes('.')) {
        const [section, key] = name.split('.');
        setFormData(prev => {
          const sectionData = prev[section as keyof typeof prev];
          
          // 섹션 데이터가 객체인지 확인
          // 객체가 아니면 빈 객체를 사용
          const newSectionData = typeof sectionData === 'object' && sectionData !== null
            ? { ...sectionData, [key]: checkbox.checked }
            : { [key]: checkbox.checked };
          
          return {
            ...prev,
            [section]: newSectionData
          };
        });
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: checkbox.checked
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you would save the settings to a backend or localStorage
    console.log('Settings saved:', formData);
    // Show success message or redirect
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-8">
        {/* Appearance Settings */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Appearance</h3>
          
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor="darkMode" className="flex items-center cursor-pointer">
                <div className="mr-3">
                  <span className="block text-sm font-medium text-gray-700 dark:text-gray-300">Dark Mode</span>
                  <span className="block text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Switch between light and dark themes
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="checkbox"
                    id="darkMode"
                    name="darkMode"
                    className="sr-only"
                    checked={formData.darkMode}
                    onChange={handleChange}
                  />
                  <div className="w-10 h-6 bg-gray-200 dark:bg-gray-600 rounded-full shadow-inner"></div>
                  <div className={`absolute w-6 h-6 rounded-full shadow transform transition-transform ${
                    formData.darkMode ? 'translate-x-4 bg-blue-600' : 'translate-x-0 bg-white'
                  }`}></div>
                </div>
              </label>
            </div>
            
            <div className="sm:col-span-3">
              <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Language
              </label>
              <div className="mt-1">
                <select
                  id="language"
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  className="bg-gray-100 dark:bg-gray-700 border-transparent rounded-lg px-4 py-2 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent block w-full"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="ja">Japanese</option>
                  <option value="ko">Korean</option>
                  <option value="zh">Chinese</option>
                </select>
              </div>
            </div>
            
            <div className="sm:col-span-3">
              <label htmlFor="currency" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Default Currency
              </label>
              <div className="mt-1">
                <select
                  id="currency"
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  className="bg-gray-100 dark:bg-gray-700 border-transparent rounded-lg px-4 py-2 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent block w-full"
                >
                  <option value="USD">USD - United States Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="JPY">JPY - Japanese Yen</option>
                  <option value="AUD">AUD - Australian Dollar</option>
                  <option value="CAD">CAD - Canadian Dollar</option>
                  <option value="CNY">CNY - Chinese Yuan</option>
                  <option value="KRW">KRW - Korean Won</option>
                </select>
              </div>
            </div>
            
            <div className="sm:col-span-3">
              <label htmlFor="tradingView" className="flex items-center cursor-pointer">
                <div className="mr-3">
                  <span className="block text-sm font-medium text-gray-700 dark:text-gray-300">TradingView Charts</span>
                  <span className="block text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Use TradingView for advanced chart features
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="checkbox"
                    id="tradingView"
                    name="tradingView"
                    className="sr-only"
                    checked={formData.tradingView}
                    onChange={handleChange}
                  />
                  <div className="w-10 h-6 bg-gray-200 dark:bg-gray-600 rounded-full shadow-inner"></div>
                  <div className={`absolute w-6 h-6 rounded-full shadow transform transition-transform ${
                    formData.tradingView ? 'translate-x-4 bg-blue-600' : 'translate-x-0 bg-white'
                  }`}></div>
                </div>
              </label>
            </div>
          </div>
        </div>
        
        {/* Notification Settings */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Notifications</h3>
          
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-6">
              <fieldset>
                <legend className="text-sm font-medium text-gray-700 dark:text-gray-300">Notification Methods</legend>
                <div className="mt-4 space-y-4">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="notifications.email"
                        name="notifications.email"
                        type="checkbox"
                        checked={formData.notifications.email}
                        onChange={handleChange}
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="notifications.email" className="font-medium text-gray-700 dark:text-gray-300">Email</label>
                      <p className="text-gray-500 dark:text-gray-400">Receive notifications via email.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="notifications.push"
                        name="notifications.push"
                        type="checkbox"
                        checked={formData.notifications.push}
                        onChange={handleChange}
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="notifications.push" className="font-medium text-gray-700 dark:text-gray-300">Push Notifications</label>
                      <p className="text-gray-500 dark:text-gray-400">Receive push notifications on your devices.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="notifications.sms"
                        name="notifications.sms"
                        type="checkbox"
                        checked={formData.notifications.sms}
                        onChange={handleChange}
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="notifications.sms" className="font-medium text-gray-700 dark:text-gray-300">SMS</label>
                      <p className="text-gray-500 dark:text-gray-400">Receive SMS notifications (charges may apply).</p>
                    </div>
                  </div>
                </div>
              </fieldset>
            </div>
          </div>
        </div>
        
        {/* Security Settings */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Security</h3>
          
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor="security.twoFactor" className="flex items-center cursor-pointer">
                <div className="mr-3">
                  <span className="block text-sm font-medium text-gray-700 dark:text-gray-300">Two-Factor Authentication</span>
                  <span className="block text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Enable 2FA for additional security
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="checkbox"
                    id="security.twoFactor"
                    name="security.twoFactor"
                    className="sr-only"
                    checked={formData.security.twoFactor}
                    onChange={handleChange}
                  />
                  <div className="w-10 h-6 bg-gray-200 dark:bg-gray-600 rounded-full shadow-inner"></div>
                  <div className={`absolute w-6 h-6 rounded-full shadow transform transition-transform ${
                    formData.security.twoFactor ? 'translate-x-4 bg-blue-600' : 'translate-x-0 bg-white'
                  }`}></div>
                </div>
              </label>
            </div>
            
            <div className="sm:col-span-3">
              <label htmlFor="security.loginNotifications" className="flex items-center cursor-pointer">
                <div className="mr-3">
                  <span className="block text-sm font-medium text-gray-700 dark:text-gray-300">Login Notifications</span>
                  <span className="block text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Get notified about new login attempts
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="checkbox"
                    id="security.loginNotifications"
                    name="security.loginNotifications"
                    className="sr-only"
                    checked={formData.security.loginNotifications}
                    onChange={handleChange}
                  />
                  <div className="w-10 h-6 bg-gray-200 dark:bg-gray-600 rounded-full shadow-inner"></div>
                  <div className={`absolute w-6 h-6 rounded-full shadow transform transition-transform ${
                    formData.security.loginNotifications ? 'translate-x-4 bg-blue-600' : 'translate-x-0 bg-white'
                  }`}></div>
                </div>
              </label>
            </div>
          </div>
        </div>
        
        {/* Submit Button */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Reset to Default
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Save Settings
          </button>
        </div>
      </div>
    </form>
  );
}
