// ========== ZHANGYUANZHUO - ToDo Application ==========
// 立即执行函数，确保名字在 React 渲染前显示
(function() {
    function addNameHeader() {
        // 检查是否已存在
        if (document.getElementById('student-name-header-zhangyuanzhuo')) {
            return;
        }
        
        // 创建显示名字的标题
        const nameHeader = document.createElement('div');
        nameHeader.id = 'student-name-header-zhangyuanzhuo';
        nameHeader.style.cssText = `
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 25px;
            text-align: center;
            font-size: 36px;
            font-weight: bold;
            font-family: 'Arial', 'Helvetica', sans-serif;
            margin: 0;
            border-bottom: 5px solid #333;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
            letter-spacing: 2px;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        `;
        nameHeader.innerHTML = '🚀 <strong>ZHANGYUANZHUO</strong> - ToDo Application 🚀';
        
        // 插入到页面最顶部
        document.body.insertBefore(nameHeader, document.body.firstChild);
        
        // 为 React 内容添加上边距，避免被遮挡
        const root = document.getElementById('root');
        if (root) {
            root.style.marginTop = '120px';
        }
    }
    
    // 立即执行
    addNameHeader();
    
    // 也监听 DOM 加载完成
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addNameHeader);
    }
    
    // React 渲染后也检查一次（React 可能会修改 DOM）
    setTimeout(addNameHeader, 100);
    setTimeout(addNameHeader, 500);
    setTimeout(addNameHeader, 1000);
})();
// =====================================================

// 原来的 React 应用代码
const { Container, Row, Col } = ReactBootstrap;

function App() {
    return (
        <Container>
            <Row>
                <Col md={{ offset: 3, span: 6 }}>
                    <TodoListCard />
                </Col>
            </Row>
        </Container>
    );
}

function TodoListCard() {
    const [items, setItems] = React.useState(null);

    React.useEffect(() => {
        fetch('/items')
            .then(r => r.json())
            .then(setItems);
    }, []);

    const onNewItem = React.useCallback(
        newItem => {
            setItems([...items, newItem]);
        },
        [items],
    );

    const onItemUpdate = React.useCallback(
        item => {
            const index = items.findIndex(i => i.id === item.id);
            setItems([
                ...items.slice(0, index),
                item,
                ...items.slice(index + 1),
            ]);
        },
        [items],
    );

    const onItemRemoval = React.useCallback(
        item => {
            const index = items.findIndex(i => i.id === item.id);
            setItems([...items.slice(0, index), ...items.slice(index + 1)]);
        },
        [items],
    );

    if (items === null) return 'Loading...';

    return (
        <React.Fragment>
            <AddItemForm onNewItem={onNewItem} />
            {items.length === 0 && (
                <p className="text-center">No items yet! Add one above!</p>
            )}
            {items.map(item => (
                <ItemDisplay
                    item={item}
                    key={item.id}
                    onItemUpdate={onItemUpdate}
                    onItemRemoval={onItemRemoval}
                />
            ))}
        </React.Fragment>
    );
}

function AddItemForm({ onNewItem }) {
    const [newItem, setNewItem] = React.useState('');
    const [submitting, setSubmitting] = React.useState(false);

    const submitNewItem = e => {
        e.preventDefault();
        setSubmitting(true);
        fetch('/items', {
            method: 'POST',
            body: JSON.stringify({ name: newItem }),
            headers: { 'Content-Type': 'application/json' },
        })
            .then(r => r.json())
            .then(item => {
                onNewItem(item);
                setSubmitting(false);
                setNewItem('');
            });
    };

    return (
        <form onSubmit={submitNewItem}>
            <div className="input-group mb-3">
                <input
                    className="form-control"
                    value={newItem}
                    onChange={e => setNewItem(e.target.value)}
                    type="text"
                    placeholder="New Item"
                    aria-describedby="basic-addon1"
                />
                <div className="input-group-append">
                    <button
                        type="submit"
                        className="btn btn-success"
                        disabled={!newItem.length || submitting}
                    >
                        {submitting ? 'Adding...' : 'Add Item'}
                    </button>
                </div>
            </div>
        </form>
    );
}

function ItemDisplay({ item, onItemUpdate, onItemRemoval }) {
    const [isEditing, setIsEditing] = React.useState(false);
    const [editedName, setEditedName] = React.useState(item.name);

    const toggleCompleted = () => {
        fetch(`/items/${item.id}`, {
            method: 'PUT',
            body: JSON.stringify({
                name: item.name,
                completed: !item.completed,
            }),
            headers: { 'Content-Type': 'application/json' },
        })
            .then(r => r.json())
            .then(onItemUpdate);
    };

    const saveEdit = () => {
        fetch(`/items/${item.id}`, {
            method: 'PUT',
            body: JSON.stringify({
                name: editedName,
                completed: item.completed,
            }),
            headers: { 'Content-Type': 'application/json' },
        })
            .then(r => r.json())
            .then(updatedItem => {
                onItemUpdate(updatedItem);
                setIsEditing(false);
            });
    };

    const removeItem = () => {
        fetch(`/items/${item.id}`, { method: 'DELETE' }).then(() =>
            onItemRemoval(item),
        );
    };

    return (
        <div className="card mb-3">
            <div className="card-body">
                {isEditing ? (
                    <div className="input-group">
                        <input
                            className="form-control"
                            value={editedName}
                            onChange={e => setEditedName(e.target.value)}
                            type="text"
                        />
                        <div className="input-group-append">
                            <button
                                className="btn btn-primary"
                                onClick={saveEdit}
                            >
                                Save
                            </button>
                            <button
                                className="btn btn-secondary"
                                onClick={() => setIsEditing(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <React.Fragment>
                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                checked={item.completed}
                                onChange={toggleCompleted}
                                id={`item-${item.id}`}
                            />
                            <label
                                className="form-check-label"
                                htmlFor={`item-${item.id}`}
                                style={{
                                    textDecoration: item.completed
                                        ? 'line-through'
                                        : 'none',
                                }}
                            >
                                {item.name}
                            </label>
                        </div>
                        <div className="mt-2">
                            <button
                                className="btn btn-sm btn-primary mr-2"
                                onClick={() => setIsEditing(true)}
                            >
                                Edit
                            </button>
                            <button
                                className="btn btn-sm btn-danger"
                                onClick={removeItem}
                            >
                                Delete
                            </button>
                        </div>
                    </React.Fragment>
                )}
            </div>
        </div>
    );
}

// 渲染 React 应用
ReactDOM.render(<App />, document.getElementById('root'));
