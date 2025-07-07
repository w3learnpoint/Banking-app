import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { toast } from 'react-toastify';
import { createUser } from '../../api/user';
import { upsertAccountDetails } from '../../api/accountDetails';
import { createNominee } from '../../api/nominee';
import { getRoles } from '../../api/role';

const ImportAccounts = () => {
    const [file, setFile] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleImport = async () => {
        if (!file) return toast.error('Please select a file');

        setIsProcessing(true);

        try {
            const allRoles = await getRoles();
            const roleMap = {};
            allRoles.forEach(role => {
                roleMap[role.name?.toLowerCase()] = role._id;
            });

            const reader = new FileReader();
            reader.onload = async (e) => {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheet = workbook.Sheets[workbook.SheetNames[0]];
                const rows = XLSX.utils.sheet_to_json(sheet);

                if (!rows || rows.length === 0) {
                    toast.error('No data found');
                    setIsProcessing(false);
                    return;
                }

                // ✅ Pre-validation phase
                for (let i = 0; i < rows.length; i++) {
                    const row = rows[i];
                    if (!row.name || !row.email || !row.password || !row.role) {
                        toast.error(`Row ${i + 1}: Missing required fields (name, email, password, role)`);
                        setIsProcessing(false);
                        return;
                    }

                    if (!roleMap[row.role?.toLowerCase()]) {
                        toast.error(`Row ${i + 1}: Invalid role "${row.role}"`);
                        setIsProcessing(false);
                        return;
                    }
                }
                // ✅ All rows validated, proceed with import
                for (let i = 0; i < rows.length; i++) {
                    const row = rows[i];
                    try {
                        const roleId = roleMap[row.role.toLowerCase()];
                        const userPayload = {
                            name: row.name,
                            email: row.email,
                            password: row.password,
                            phone: row.phone,
                            dob: row.dob ? new Date(row.dob).toISOString().substr(0, 10) : '',
                            status: row.status?.toLowerCase() === 'active',
                            role: roleId
                        };
                        const userRes = await createUser(userPayload);
                        const userId = userRes._id;

                        const accountPayload = {
                            user: userId,
                            branch: row.branch,
                            fatherOrHusbandName: row.fatherOrHusbandName,
                            guardianName: row.guardianName,
                            mobile: row.accountMobile,
                            aadhar: row.aadhar,
                            depositAmount: Number(row.depositAmount),
                            accountType: row.accountType,
                            formDate: row.formDate,
                            ifsc: row.ifsc,
                            introducerName: row.introducerName,
                            membershipNumber: row.membershipNumber,
                            address: {
                                village: row.village,
                                post: row.post,
                                block: row.block,
                                district: row.district,
                                pincode: row.pincode
                            }
                        };
                        await upsertAccountDetails(accountPayload);

                        const nomineePayload = {
                            name: row.nomineeName,
                            relation: row.nomineeRelation,
                            age: Number(row.nomineeAge),
                            mobile: row.nomineePhone
                        };
                        await createNominee(userId, nomineePayload);

                        toast.success(`Row ${i + 1}: Imported successfully`);
                    } catch (err) {
                        toast.error(`Row ${i + 1}: Failed - ${err?.message || 'Unknown error'}`);
                        setIsProcessing(false);
                        return;
                    }
                }

                toast.success('All records imported successfully');
                setIsProcessing(false);
            };

            reader.readAsArrayBuffer(file);
        } catch (err) {
            console.error(err);
            toast.error('Failed to import: ' + err.message);
            setIsProcessing(false);
        }
    };

    return (
        <div className="container my-5">
            <h4>Import Accounts</h4>
            <div className="mb-3">
                <input type="file" className="form-control" accept=".csv, .xlsx" onChange={handleFileChange} />
            </div>
            <button className="btn btn-primary" onClick={handleImport} disabled={isProcessing}>
                {isProcessing ? 'Processing...' : 'Import'}
            </button>
        </div>
    );
};

export default ImportAccounts;
