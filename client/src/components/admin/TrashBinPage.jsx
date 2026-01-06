import React from 'react';
import TrashBin from './TrashBin';

const TrashBinPage = () => {
    return (
        <div>
            <div className="admin-section-header">
                <h2>Recycle Bin</h2>
            </div>
            <TrashBin />
        </div>
    );
};

export default TrashBinPage;
