// src/storage.js - Local Storage操作

// ----- ユーザーデータ読み込み -----
function loadUserData() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return [];
        const parsed = JSON.parse(stored);
        if (!Array.isArray(parsed)) return [];
        // centuryを再計算して返す
        return parsed.map((item) => ({
            ...item,
            century: getCentury(item.year),
            isInitial: false
        }));
    } catch (e) {
        console.warn("Local Storageのデータ読み込みに失敗しました:", e);
        return [];
    }
}

// ----- ユーザーデータ保存 -----
function saveUserData() {
    const { userAddedEvents } = getState();
    try {
        // isInitial, century を除いて保存
        const dataToSave = userAddedEvents.map(({ year, event, category, img, alt, note }) => {
            const item = { year, event, category };
            if (img) item.img = img;
            if (alt) item.alt = alt;
            if (note) item.note = note;
            return item;
        });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (e) {
        console.error("Local Storageへの保存に失敗しました:", e);
        alert("データの保存に失敗しました。ストレージ容量を確認してください。");
    }
}
