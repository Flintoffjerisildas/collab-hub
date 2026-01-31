import React from 'react'

function Alert({ onClose, onConfirm }) {

    return (
        // popup window for alert
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="glass-panel p-6 rounded-3xl max-w-sm w-full mx-4 shadow-2xl">
                <h3 className="text-xl font-bold mb-2">Are you sure?</h3>
                <p className="text-muted-foreground mb-6">This action cannot be undone.</p>
                <div className="flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 rounded-full text-sm font-medium hover:bg-black/5 transition-colors">Cancel</button>
                    <button onClick={onConfirm} className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full text-sm font-medium shadow-lg hover:shadow-red-500/30 transition-all">Confirm</button>
                </div>
            </div>
        </div>
    )
}

export default Alert