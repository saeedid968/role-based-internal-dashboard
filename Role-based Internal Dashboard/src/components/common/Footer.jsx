import React from 'react'

const Footer = () => {
    return (
        <>{/* Page Footer */}
            <footer className="mt-12 py-8 border-t border-slate-200 dark:border-gray-800 text-center">
                <p className="text-sm text-slate-500 dark:text-slate-400">© 2024 Product Engineering Dashboard • Internal Use Only</p>
                <div className="flex justify-center gap-6 mt-2 text-xs text-slate-400">
                    <a href="#" className="hover:text-blue-600">Privacy Policy</a>
                    <a href="#" className="hover:text-blue-600">Admin Guidelines</a>
                    <a href="#" className="hover:text-blue-600">Support</a>
                </div>
            </footer>
        </>
    )
}

export default Footer