'use client';

import React, { useState } from 'react';
import { Bell, X, TrendingUp, TrendingDown } from 'lucide-react';

interface PriceAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticker: string;
  currentPrice: number;
}

type AlertType = 'above' | 'below';

interface Alert {
  id: string;
  type: AlertType;
  price: number;
  active: boolean;
}

export default function PriceAlertModal({
  isOpen,
  onClose,
  ticker,
  currentPrice,
}: PriceAlertModalProps) {
  const [alerts, setAlerts] = useState<Alert[]>([
    { id: '1', type: 'above', price: currentPrice * 1.05, active: true },
    { id: '2', type: 'below', price: currentPrice * 0.95, active: true },
  ]);
  const [newAlertType, setNewAlertType] = useState<AlertType>('above');
  const [newAlertPrice, setNewAlertPrice] = useState<string>(
    (currentPrice * 1.05).toFixed(2)
  );

  if (!isOpen) return null;

  const addAlert = () => {
    const price = parseFloat(newAlertPrice);
    if (isNaN(price) || price <= 0) return;

    const newAlert: Alert = {
      id: Date.now().toString(),
      type: newAlertType,
      price,
      active: true,
    };

    setAlerts([...alerts, newAlert]);
    setNewAlertPrice((currentPrice * 1.05).toFixed(2));
  };

  const removeAlert = (id: string) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };

  const toggleAlert = (id: string) => {
    setAlerts(
      alerts.map(alert =>
        alert.id === id ? { ...alert, active: !alert.active } : alert
      )
    );
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#0D0D0F] border border-[#1A1A1F] rounded-2xl max-w-md w-full max-h-[80vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-primary">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent-cyan/10 rounded-lg">
              <Bell size={20} className="text-accent-cyan" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-text-primary">Price Alerts</h2>
              <p className="text-xs text-text-tertiary">{ticker} - ${currentPrice.toFixed(2)}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-background-tertiary rounded-lg transition-colors"
          >
            <X size={20} className="text-text-secondary" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(80vh-180px)]">
          {/* Create New Alert */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-text-primary">Create Alert</h3>

            {/* Alert Type */}
            <div className="flex gap-2">
              <button
                onClick={() => setNewAlertType('above')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium text-sm transition-all ${
                  newAlertType === 'above'
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : 'bg-background-secondary text-text-secondary hover:bg-background-tertiary'
                }`}
              >
                <TrendingUp size={16} />
                Above
              </button>
              <button
                onClick={() => setNewAlertType('below')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium text-sm transition-all ${
                  newAlertType === 'below'
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                    : 'bg-background-secondary text-text-secondary hover:bg-background-tertiary'
                }`}
              >
                <TrendingDown size={16} />
                Below
              </button>
            </div>

            {/* Price Input */}
            <div className="space-y-2">
              <label className="text-xs text-text-secondary">Target Price</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary">$</span>
                <input
                  type="number"
                  step="0.01"
                  value={newAlertPrice}
                  onChange={(e) => setNewAlertPrice(e.target.value)}
                  className="w-full bg-background-secondary border border-border-primary rounded-lg pl-8 pr-4 py-2.5 text-sm font-mono text-text-primary focus:outline-none focus:border-accent-cyan"
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Add Button */}
            <button
              onClick={addAlert}
              className="w-full bg-accent-cyan hover:bg-accent-cyan/80 text-black font-semibold py-2.5 rounded-lg transition-colors"
            >
              Create Alert
            </button>
          </div>

          {/* Active Alerts */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-text-primary">
              Active Alerts ({alerts.filter(a => a.active).length})
            </h3>

            {alerts.length === 0 ? (
              <div className="text-center py-8 text-text-tertiary text-xs">
                No alerts set
              </div>
            ) : (
              <div className="space-y-2">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                      alert.active
                        ? 'bg-background-secondary border-border-primary'
                        : 'bg-background-secondary/50 border-border-primary opacity-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        alert.type === 'above'
                          ? 'bg-green-500/10 text-green-400'
                          : 'bg-red-500/10 text-red-400'
                      }`}>
                        {alert.type === 'above' ? (
                          <TrendingUp size={16} />
                        ) : (
                          <TrendingDown size={16} />
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-text-primary">
                          ${alert.price.toFixed(2)}
                        </div>
                        <div className="text-xs text-text-tertiary">
                          {alert.type === 'above' ? 'Above' : 'Below'} target
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleAlert(alert.id)}
                        className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                          alert.active
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-gray-500/20 text-gray-400'
                        }`}
                      >
                        {alert.active ? 'On' : 'Off'}
                      </button>
                      <button
                        onClick={() => removeAlert(alert.id)}
                        className="p-1.5 hover:bg-red-500/20 rounded text-red-400 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border-primary bg-background-secondary/50">
          <p className="text-xs text-text-tertiary text-center">
            You'll receive notifications when price reaches your targets
          </p>
        </div>
      </div>
    </div>
  );
}
