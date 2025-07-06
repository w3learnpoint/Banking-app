import React, { useEffect, useState } from 'react';
import { fetchUserSettings, updateUserSettings } from '../../api/settings';
import { toast } from 'react-toastify';
import { Spinner } from 'react-bootstrap';

const themes = [
    { value: 'auto', label: 'Auto (System)' },
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark (Default)' },
];

const fonts = [
    { value: '"DM Sans", sans-serif', label: 'DM Sans (Default)' },
    { value: 'system-ui', label: 'System Default' },
    { value: 'Roboto, sans-serif', label: 'Roboto' },
    { value: 'Arial, sans-serif', label: 'Arial' },
];

const fontSizes = [
    { value: '14px', label: 'Small' },
    { value: '16px', label: 'Medium (Default)' },
    { value: '18px', label: 'Large' },
];

const defaultSettings = {
    theme: 'auto',
    font: '"DM Sans", sans-serif',
    fontSize: '16px',
    websiteLogo: '',
    websiteName: '',
    favicon: '',
    websiteTitle: ''
};

const Setting = () => {
    const [theme, setTheme] = useState(defaultSettings.theme);
    const [font, setFont] = useState(defaultSettings.font);
    const [fontSize, setFontSize] = useState(defaultSettings.fontSize);
    const [websiteLogo, setWebsiteLogo] = useState(defaultSettings.websiteLogo);
    const [websiteName, setWebsiteName] = useState(defaultSettings.websiteName);
    const [favicon, setFavicon] = useState(defaultSettings.favicon);
    const [websiteTitle, setWebsiteTitle] = useState(defaultSettings.websiteTitle);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUserSettings()
            .then((settings) => {
                setTheme(settings.theme || defaultSettings.theme);
                setFont(settings.font || defaultSettings.font);
                setFontSize(settings.fontSize || defaultSettings.fontSize);
                setWebsiteLogo(settings.websiteLogo || '');
                setWebsiteName(settings.websiteName || '');
                setFavicon(settings.favicon || '');
                setWebsiteTitle(settings.websiteTitle || '');
                applySettings(settings.theme, settings.font, settings.fontSize);
            })
            .catch(() => {
                toast.error("Failed to load settings");
                applySettings(defaultSettings.theme, defaultSettings.font, defaultSettings.fontSize);
            })
            .finally(() => setLoading(false));
    }, []);

    const applySettings = (theme, font, fontSize) => {
        const actualTheme = theme === 'auto'
            ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
            : theme;

        document.documentElement.setAttribute('data-theme', actualTheme);
        document.body.style.fontFamily = font;
        document.body.style.fontSize = fontSize;

        localStorage.setItem('user-theme', theme);
        localStorage.setItem('user-font', font);
        localStorage.setItem('user-font-size', fontSize);
    };

    const handleSave = async () => {
        try {
            await updateUserSettings({
                theme,
                font,
                fontSize,
                websiteLogo,
                websiteName,
                favicon,
                websiteTitle
            });
            applySettings(theme, font, fontSize);
            toast.success("Settings saved successfully");
        } catch (err) {
            console.error(err);
            toast.error("Failed to save settings");
        }
    };

    const handleReset = () => {
        setTheme(defaultSettings.theme);
        setFont(defaultSettings.font);
        setFontSize(defaultSettings.fontSize);
        setWebsiteLogo(defaultSettings.websiteLogo);
        setWebsiteName(defaultSettings.websiteName);
        setFavicon(defaultSettings.favicon);
        setWebsiteTitle(defaultSettings.websiteTitle);
        applySettings(defaultSettings.theme, defaultSettings.font, defaultSettings.fontSize);
        toast.info("Settings reset to default");
    };

    if (loading) {
        return <div className="text-center mt-5"><Spinner animation="border" /></div>;
    }

    return (
        <div className="setting-wrapper px-4 py-4 theme-bg">
            <div className="card theme-card p-4">
                <h4 className="mb-3 theme-text">User Settings</h4>

                {/* Theme */}
                <div className="form-group mb-3">
                    <label htmlFor="themeSelect" className='theme-label text-black'>Theme</label>
                    <select
                        className="form-select form-control-sm"
                        id="themeSelect"
                        value={theme}
                        onChange={(e) => setTheme(e.target.value)}
                    >
                        {themes.map((t) => (
                            <option key={t.value} value={t.value}>{t.label}</option>
                        ))}
                    </select>
                </div>

                {/* Font */}
                <div className="form-group mb-3">
                    <label htmlFor="fontSelect" className='theme-label text-black'>Font</label>
                    <select
                        className="form-select form-control-sm"
                        id="fontSelect"
                        value={font}
                        onChange={(e) => setFont(e.target.value)}
                        style={{ fontFamily: font }}
                    >
                        {fonts.map((f) => (
                            <option key={f.value} value={f.value} style={{ fontFamily: f.value }}>
                                {f.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Font Size */}
                <div className="form-group mb-3">
                    <label htmlFor="fontSizeSelect" className='theme-label text-black'>Font Size</label>
                    <select
                        className="form-select form-control-sm"
                        id="fontSizeSelect"
                        value={fontSize}
                        onChange={(e) => setFontSize(e.target.value)}
                    >
                        {fontSizes.map((f) => (
                            <option key={f.value} value={f.value}>{f.label}</option>
                        ))}
                    </select>
                </div>

                {/* Website Logo */}
                <div className="form-group mb-3">
                    <label className='theme-label text-black'>Website Logo URL</label>
                    <input
                        type="text"
                        className="form-control form-control-sm"
                        value={websiteLogo}
                        onChange={(e) => setWebsiteLogo(e.target.value)}
                    />
                </div>

                {/* Website Name */}
                <div className="form-group mb-3">
                    <label className='theme-label text-black'>Website Name</label>
                    <input
                        type="text"
                        className="form-control form-control-sm"
                        value={websiteName}
                        onChange={(e) => setWebsiteName(e.target.value)}
                    />
                </div>

                {/* Favicon */}
                <div className="form-group mb-3">
                    <label className='theme-label text-black'>Favicon URL</label>
                    <input
                        type="text"
                        className="form-control form-control-sm"
                        value={favicon}
                        onChange={(e) => setFavicon(e.target.value)}
                    />
                </div>

                {/* Website Title */}
                <div className="form-group mb-3">
                    <label className='theme-label text-black'>Website Title</label>
                    <input
                        type="text"
                        className="form-control form-control-sm"
                        value={websiteTitle}
                        onChange={(e) => setWebsiteTitle(e.target.value)}
                    />
                </div>

                <div className="d-flex justify-content-between mt-4">
                    <button className="btn theme-btn" onClick={handleSave}>
                        Save Settings
                    </button>
                    <button className="btn theme-btn-secondary" onClick={handleReset}>
                        Reset to Default
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Setting;
