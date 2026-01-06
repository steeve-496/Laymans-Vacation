import React from 'react';
import AuditLogViewer from './AuditLogViewer';

const AuditLogPage = () => {
    return (
        <div>
            <div className="admin-section-header">
                <h2>Activity Logs</h2>
            </div>
            <AuditLogViewer />
        </div>
    );
};

export default AuditLogPage;
