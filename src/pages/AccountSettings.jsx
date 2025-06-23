import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import Auth from '../components/Auth';
import { useNavigate } from 'react-router-dom';

export default function AccountSettings() {
  const [user, setUser] = useState(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [members, setMembers] = useState([]);
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMember, setNewMember] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    birth_date: '',
    address_street: '',
    address_st_num: '',
    address_city: '',
    newsletter: false,
    role: 'user'
  });
  const [editMemberId, setEditMemberId] = useState('');
  const [editMemberData, setEditMemberData] = useState({
    first_name: '',
    last_name: '',
    birth_date: '',
    address_street: '',
    address_st_num: '',
    address_city: '',
    newsletter: false,
    role: 'user'
  });
  const [deleteUid, setDeleteUid] = useState('');
  const [adminActionMsg, setAdminActionMsg] = useState('');
  const [grantAdminUid, setGrantAdminUid] = useState('');
  const [grantAdminMsg, setGrantAdminMsg] = useState('');
  const [removeAdminUid, setRemoveAdminUid] = useState('');
  const [removeAdminMsg, setRemoveAdminMsg] = useState('');
  const [dbUsers, setDbUsers] = useState([]);
  const [showEditMember, setShowEditMember] = useState(false);
  const [showDbUsers, setShowDbUsers] = useState(false);
  const [membership, setMembership] = useState(null);
  const [allMemberships, setAllMemberships] = useState([]);
  const [adminUid, setAdminUid] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [membershipPopup, setMembershipPopup] = useState(null); // For popup data
  const [popupUserId, setPopupUserId] = useState(null); // For which user to show
  const navigate = useNavigate();

  useEffect(() => {
    // Get the logged-in user
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    // Fetch membership info for the logged-in user
    if (user) {
      supabase
        .from('user_membership')
        .select('*') // <-- fetch all columns!
        .eq('id', user.id)
        .single()
        .then(({ data }) => {
          setMembership(data);
          console.log('Membership from DB:', data);
        });
    }
  }, [user]);

  // Fetch all memberships if superuser
  useEffect(() => {
    if (membership?.role === 'superuser') {
      supabase
        .from('user_membership')
        .select('*')
        .then(({ data }) => setAllMemberships(data || []));
    }
  }, [membership]);

  useEffect(() => {
    fetchDbUsers();
  }, [membership]);

  useEffect(() => {
    fetchAllMemberships();
  }, [membership]);

  // Fetch all members if admin or superuser (Auth users)
  useEffect(() => {
    const fetchMembers = async () => {
      if (user?.user_metadata?.role === 'admin' || user?.user_metadata?.role === 'superuser') {
        const { data, error } = await supabase.auth.admin.listUsers();
        if (!error) setMembers(data.users);
      }
    };
    fetchMembers();
  }, [user]);

  // Fetch all users from the database users table
  const fetchDbUsers = async () => {
    if (membership?.role === 'admin' || membership?.role === 'superuser') {
      const { data, error } = await supabase.from('users').select('*');
      if (!error) setDbUsers(data);
    }
  };

  // Fetch all memberships (for superuser)
  const fetchAllMemberships = async () => {
    if (membership?.role === 'superuser') {
      const { data } = await supabase.from('user_membership').select('*');
      setAllMemberships(data || []);
    }
  };

  // Fetch membership info for popup
  useEffect(() => {
    if (popupUserId) {
      supabase
        .from('user_membership')
        .select('*')
        .eq('id', popupUserId)
        .single()
        .then(({ data }) => setMembershipPopup(data));
    } else {
      setMembershipPopup(null);
    }
  }, [popupUserId]);

  if (!user) {
    return <Auth />;
  }
  
  const isSuperuser = membership?.role === 'superuser';
  const isAdmin = membership?.role === 'admin' || membership?.role === 'superuser';
  const birthDate = user.user_metadata?.birth_date || '';

  // Helper to display address
  const formatAddress = (user) => {
    const street = user?.user_metadata?.address_street || '';
    const num = user?.user_metadata?.address_st_num || '';
    const city = user?.user_metadata?.address_city || '';
    if (!street && !num && !city) return '';
    return `${street} ${num}, ${city}`.trim();
  };

  // Admin: Add new member (sign up style)
  const handleAddMember = async () => {
    setAdminActionMsg('');
    const {
      email, password, first_name, last_name, birth_date,
      address_street, address_st_num, address_city, newsletter, role
    } = newMember;
    if (!email || !password || !first_name || !last_name) {
      setAdminActionMsg('Email, password, first name, and last name are required.');
      return;
    }
    try {
      const res = await fetch('http://localhost:4000/api/add-member', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          first_name,
          last_name,
          birth_date,
          address_street,
          address_st_num,
          address_city,
          newsletter,
          role
        })
      });
      const result = await res.json();
      if (res.ok) {
        setAdminActionMsg('New member created! A confirmation email has been sent.');
        setNewMember({
          email: '',
          password: '',
          first_name: '',
          last_name: '',
          birth_date: '',
          address_street: '',
          address_st_num: '',
          address_city: '',
          newsletter: false,
          role: 'user'
        });
        // After adding/editing/deleting a member
        await fetchDbUsers();
        await fetchAllMemberships();
      } else {
        setAdminActionMsg(result.error || 'Failed to add member.');
      }
    } catch (err) {
      setAdminActionMsg('Failed to connect to backend.');
    }
  };

  // Admin: Edit member info (edit both Auth and users table)
  const handleEditMember = async () => {
    setAdminActionMsg('');
    try {
      const res = await fetch('http://localhost:4000/api/edit-member', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editMemberId,
          ...editMemberData
        })
      });
      const result = await res.json();
      if (res.ok) {
        setAdminActionMsg('Member info updated!');
        // Optionally refresh members list here
        await fetchDbUsers();
        await fetchAllMemberships();
      } else {
        setAdminActionMsg(result.error || 'Failed to update member.');
      }
    } catch (err) {
      setAdminActionMsg('Failed to connect to backend.');
    }
  };

  // Admin: Delete member
  const handleDeleteMember = async (id) => {
    setAdminActionMsg('');
    try {
      const res = await fetch('http://localhost:4000/api/delete-member', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      const result = await res.json();
      if (res.ok) {
        setAdminActionMsg('Member deleted!');
        // Optionally refresh members list here
        await fetchDbUsers();
        await fetchAllMemberships();
      } else {
        setAdminActionMsg(result.error || 'Failed to delete member.');
      }
    } catch (err) {
      setAdminActionMsg('Failed to connect to backend.');
    }
  };

  // Superuser: Grant admin
  const handleGrantAdmin = async () => {
    setGrantAdminMsg('');
    if (!grantAdminUid) {
      setGrantAdminMsg('Please enter a user UID.');
      return;
    }
    const { error } = await supabase.auth.admin.updateUserById(grantAdminUid, {
      user_metadata: { role: 'admin' }
    });
    if (error) setGrantAdminMsg(error.message);
    else setGrantAdminMsg('Admin status granted!');
  };

  // Superuser: Remove admin
  const handleRemoveAdmin = async () => {
    setRemoveAdminMsg('');
    if (!removeAdminUid) {
      setRemoveAdminMsg('Please enter a user UID.');
      return;
    }
    const { error } = await supabase.auth.admin.updateUserById(removeAdminUid, {
      user_metadata: { role: 'user' }
    });
    if (error) setRemoveAdminMsg(error.message);
    else setRemoveAdminMsg('Admin status removed!');
  };

  // Handler for uploading CSV data
  const handleUploadData = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const text = await file.text();
    // Parse CSV (simple split, for production use a library like PapaParse)
    const rows = text.trim().split('\n').map(row => row.split(','));
    const headers = rows[0];
    const data = rows.slice(1).map(row =>
      Object.fromEntries(row.map((cell, i) => [headers[i], cell]))
    );
    // Insert data into users table
    const { error } = await supabase.from('users').insert(data);
    if (error) {
      setAdminActionMsg('Failed to upload data: ' + error.message);
    } else {
      setAdminActionMsg('Data uploaded successfully!');
    }
  };

  // Handler for deleting all users (dangerous!)
  const handleDeleteAllData = async () => {
    if (!window.confirm('Are you sure you want to delete ALL users in the database table? This cannot be undone!')) return;
    const { error } = await supabase.from('users').delete().neq('id', ''); // deletes all rows
    if (error) {
      setAdminActionMsg('Failed to delete all data: ' + error.message);
    } else {
      setAdminActionMsg('All user data deleted!');
    }
  };

  // Grant or remove admin status
  const handleToggleAdmin = async (makeAdmin) => {
    setAdminActionMsg('');
    if (!adminUid) {
      setAdminActionMsg('Please enter a user UID.');
      return;
    }
    // Fetch current role
    const { data: member, error } = await supabase
      .from('user_membership')
      .select('role')
      .eq('id', adminUid)
      .single();
    if (error || !member) {
      setAdminActionMsg('User not found.');
      return;
    }
    if (member.role === 'superuser') {
      setAdminActionMsg('Cannot change role of a superuser.');
      return;
    }
    const newRole = makeAdmin ? 'admin' : 'user';
    const { error: updateError } = await supabase
      .from('user_membership')
      .update({ role: newRole })
      .eq('id', adminUid);
    if (updateError) {
      setAdminActionMsg('Failed to update role: ' + updateError.message);
    } else {
      setAdminActionMsg(`Role updated to ${newRole}.`);
      // Refresh memberships table
      const { data } = await supabase.from('user_membership').select('*');
      setAllMemberships(data || []);
    }
  };

  // Filtered users based on search
  const filteredDbUsers = dbUsers.filter(u => {
    const term = searchTerm.toLowerCase();
    return (
      u.id?.toLowerCase().includes(term) ||
      u.first_name?.toLowerCase().includes(term) ||
      u.last_name?.toLowerCase().includes(term) ||
      u.email?.toLowerCase().includes(term) // <-- Add this line
    );
  });

  return (
    <div>
      <h2>Account Settings</h2>
      <h3>Account Info</h3>
      <div>
        <b>Name:</b> {user?.user_metadata?.display_name || ''}<br />
        <b>Email:</b> {user?.email || ''}<br />
        <b>Address:</b> {formatAddress(user)}<br />
        <b>Phone number:</b> {user.user_metadata?.phone}<br />
        <b>Birth date:</b> {birthDate}<br />
        <b>Password:</b>{' '}
        <span>
          {passwordVisible ? '••••••••' : '********'}
          <button
            style={{ marginLeft: 8 }}
            onClick={() => setPasswordVisible(v => !v)}
          >
            {passwordVisible ? 'Hide' : 'Show'}
          </button>
        </span>
        <br />
        <b>Last payment date:</b> {membership?.last_payment || ''}<br />
        <b>Valid through:</b> {membership?.valid_through || ''}<br />
      </div>
      <button onClick={() => navigate('/edit-account-settings')}>Edit</button>
      <button onClick={() => navigate('/renew-membership')} style={{ marginLeft: 8 }}>Renew Membership</button>
      <button onClick={() => supabase.auth.signOut()} style={{ marginLeft: 8 }}>Logout</button>
      <button onClick={() => navigate('/')} style={{ marginLeft: 8 }}>Back to Home</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      {isAdmin && (
        <div style={{ marginTop: 40, borderTop: '1px solid #ccc', paddingTop: 20 }}>
          <h3>Admin Functions</h3>
          {/* See all members */}

          {/* --- Add this block for DB users table --- */}
          <h4>All Members (Database Table)</h4>
          <input
            type="text"
            placeholder="Search by UID, First, Last Name or Email"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ marginBottom: 8, width: 300 }}
          />
          <div style={{ overflowX: 'auto', border: '1px solid #eee', marginTop: 8 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ border: '1px solid #ccc', padding: 4 }}>ID</th>
                  <th style={{ border: '1px solid #ccc', padding: 4 }}>First Name</th>
                  <th style={{ border: '1px solid #ccc', padding: 4 }}>Last Name</th>
                  <th style={{ border: '1px solid #ccc', padding: 4 }}>Email</th>
                  <th style={{ border: '1px solid #ccc', padding: 4 }}>Birth Date</th>
                  <th style={{ border: '1px solid #ccc', padding: 4 }}>Street</th>
                  <th style={{ border: '1px solid #ccc', padding: 4 }}>Street Num</th>
                  <th style={{ border: '1px solid #ccc', padding: 4 }}>City</th>
                  <th style={{ border: '1px solid #ccc', padding: 4 }}>Newsletter</th>
                  <th style={{ border: '1px solid #ccc', padding: 4 }}>Created At</th>
                </tr>
              </thead>
              <tbody>
                {filteredDbUsers.map(u => (
                  <tr key={u.id} style={{ cursor: 'pointer' }} onClick={() => setPopupUserId(u.id)}>
                    <td style={{ border: '1px solid #ccc', padding: 4 }}>{u.id}</td>
                    <td style={{ border: '1px solid #ccc', padding: 4 }}>{u.first_name}</td>
                    <td style={{ border: '1px solid #ccc', padding: 4 }}>{u.last_name}</td>
                    <td style={{ border: '1px solid #ccc', padding: 4 }}>{u.email}</td>
                    <td style={{ border: '1px solid #ccc', padding: 4 }}>{u.birth_date}</td>
                    <td style={{ border: '1px solid #ccc', padding: 4 }}>{u.address_street}</td>
                    <td style={{ border: '1px solid #ccc', padding: 4 }}>{u.address_st_num}</td>
                    <td style={{ border: '1px solid #ccc', padding: 4 }}>{u.address_city}</td>
                    <td style={{ border: '1px solid #ccc', padding: 4 }}>{u.newsletter ? 'Yes' : 'No'}</td>
                    <td style={{ border: '1px solid #ccc', padding: 4 }}>{u.created_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* --- End DB users table block --- */}

          {/* Add new member */}
          <h4>Add New Member</h4>
          <button onClick={() => setShowAddMember(s => !s)}>
            {showAddMember ? 'Hide Add Member Form' : 'Show Add Member Form'}
          </button>
          {showAddMember && (
            <div style={{ marginTop: 8 }}>
              <input
                type="email"
                placeholder="Email"
                value={newMember.email}
                onChange={e => setNewMember({ ...newMember, email: e.target.value })}
              /><br />
              <input
                type="password"
                placeholder="Password"
                value={newMember.password}
                onChange={e => setNewMember({ ...newMember, password: e.target.value })}
              /><br />
              <input
                type="text"
                placeholder="First Name"
                value={newMember.first_name}
                onChange={e => setNewMember({ ...newMember, first_name: e.target.value })}
              /><br />
              <input
                type="text"
                placeholder="Last Name"
                value={newMember.last_name}
                onChange={e => setNewMember({ ...newMember, last_name: e.target.value })}
              /><br />
              <input
                type="date"
                placeholder="Birth date"
                value={newMember.birth_date}
                onChange={e => setNewMember({ ...newMember, birth_date: e.target.value })}
              /><br />
              <input
                type="text"
                placeholder="Street"
                value={newMember.address_street}
                onChange={e => setNewMember({ ...newMember, address_street: e.target.value })}
              /><br />
              <input
                type="text"
                placeholder="Street Number"
                value={newMember.address_st_num}
                onChange={e => setNewMember({ ...newMember, address_st_num: e.target.value })}
              /><br />
              <input
                type="text"
                placeholder="City"
                value={newMember.address_city}
                onChange={e => setNewMember({ ...newMember, address_city: e.target.value })}
              /><br />
              <label>
                <input
                  type="checkbox"
                  checked={newMember.newsletter}
                  onChange={e => setNewMember({ ...newMember, newsletter: e.target.checked })}
                /> Newsletter
              </label>
              <br />
              <select
                value={newMember.role}
                onChange={e => setNewMember({ ...newMember, role: e.target.value })}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              <br />
              <button onClick={handleAddMember} style={{ marginTop: 8 }}>Add Member</button>
            </div>
          )}

          {/* Edit member info */}
          <h4>Edit Member Info</h4>
          <input
            type="text"
            placeholder="User UID"
            value={editMemberId}
            onChange={e => setEditMemberId(e.target.value)}
          /><br />
          <input
            type="text"
            placeholder="First Name"
            value={editMemberData.first_name}
            onChange={e => setEditMemberData({ ...editMemberData, first_name: e.target.value })}
          /><br />
          <input
            type="text"
            placeholder="Last Name"
            value={editMemberData.last_name}
            onChange={e => setEditMemberData({ ...editMemberData, last_name: e.target.value })}
          /><br />
          <input
            type="date"
            placeholder="Birth date"
            value={editMemberData.birth_date}
            onChange={e => setEditMemberData({ ...editMemberData, birth_date: e.target.value })}
          /><br />
          <input
            type="text"
            placeholder="Street"
            value={editMemberData.address_street}
            onChange={e => setEditMemberData({ ...editMemberData, address_street: e.target.value })}
          /><br />
          <input
            type="text"
            placeholder="Street Number"
            value={editMemberData.address_st_num}
            onChange={e => setEditMemberData({ ...editMemberData, address_st_num: e.target.value })}
          /><br />
          <input
            type="text"
            placeholder="City"
            value={editMemberData.address_city}
            onChange={e => setEditMemberData({ ...editMemberData, address_city: e.target.value })}
          /><br />
          <label>
            <input
              type="checkbox"
              checked={editMemberData.newsletter}
              onChange={e => setEditMemberData({ ...editMemberData, newsletter: e.target.checked })}
            /> Newsletter
          </label>
          <br />
          <button onClick={handleEditMember} style={{ marginTop: 8 }}>Update Member</button>

          {/* Delete member */}
          <h4>Delete Member</h4>
          <input
            type="text"
            placeholder="User UID"
            value={deleteUid}
            onChange={e => setDeleteUid(e.target.value)}
          />
          <button onClick={() => handleDeleteMember(deleteUid)} style={{ marginLeft: 8 }}>Delete Member</button>

          {/* DB actions (empty for now) */}
          <h4>Database Actions</h4>
          <div style={{ marginBottom: 16 }}>
            {/* Upload Data */}
            <label style={{ marginRight: 8 }}>
              <input
                type="file"
                accept=".csv"
                style={{ display: 'none' }}
                onChange={handleUploadData}
                id="upload-csv"
              />
              <button onClick={() => document.getElementById('upload-csv').click()}>
                Upload Data
              </button>
            </label>

            {/* Edit Data */}
            <button
              style={{ marginRight: 8 }}
              onClick={() => setShowEditMember(true)}
            >
              Edit Data
            </button>

            {/* Read Data */}
            <button
              style={{ marginRight: 8 }}
              onClick={() => setShowDbUsers(true)}
            >
              Read Data
            </button>

            {/* Delete Data */}
            <button
              style={{ background: 'red', color: 'white' }}
              onClick={handleDeleteAllData}
            >
              Delete Data
            </button>
          </div>

          {/* Show Edit Member Info */}
          {showEditMember && (
            <div>
              {/* ...your Edit Member Info form here... */}
            </div>
          )}

          {/* Show All Members (Database Table) */}
          {showDbUsers && (
            <div>
              {/* ...your All Members (Database Table) table here... */}
            </div>
          )}

          {adminActionMsg && <p style={{ color: 'blue' }}>{adminActionMsg}</p>}
        </div>
      )}

      {isSuperuser && (
        <div style={{ marginTop: 40, borderTop: '2px solid #888', paddingTop: 20 }}>
          <h3>Superuser Functions</h3>
          {/* Table of all user_membership */}
          <h4>All Memberships</h4>
          <div style={{ overflowX: 'auto', border: '1px solid #eee', marginTop: 8 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ border: '1px solid #ccc', padding: 4 }}>UID</th>
                  <th style={{ border: '1px solid #ccc', padding: 4 }}>Role</th>
                  <th style={{ border: '1px solid #ccc', padding: 4 }}>Is Member</th>
                  <th style={{ border: '1px solid #ccc', padding: 4 }}>Last Payment</th>
                  <th style={{ border: '1px solid #ccc', padding: 4 }}>Valid Through</th>
                </tr>
              </thead>
              <tbody>
                {allMemberships.map(m => (
                  <tr
                    key={m.id}
                    style={{ cursor: 'pointer' }}
                    onClick={() => setPopupUserId(m.id)}
                  >
                    <td style={{ border: '1px solid #ccc', padding: 4 }}>{m.id}</td>
                    <td style={{ border: '1px solid #ccc', padding: 4 }}>{m.role}</td>
                    <td style={{ border: '1px solid #ccc', padding: 4 }}>{m.is_member ? 'Yes' : 'No'}</td>
                    <td style={{ border: '1px solid #ccc', padding: 4 }}>{m.last_payment || ''}</td>
                    <td style={{ border: '1px solid #ccc', padding: 4 }}>{m.valid_through || ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Grant/remove admin status */}
          <div style={{ marginTop: 24 }}>
            <h4>Grant or Remove Admin Status</h4>
            <input
              type="text"
              placeholder="User UID"
              value={adminUid}
              onChange={e => setAdminUid(e.target.value)}
              style={{ marginRight: 8 }}
            />
            <button onClick={() => handleToggleAdmin(true)} style={{ marginRight: 8 }}>
              Grant Admin
            </button>
            <button onClick={() => handleToggleAdmin(false)}>
              Remove Admin
            </button>
            {adminActionMsg && <div style={{ color: 'green', marginTop: 8 }}>{adminActionMsg}</div>}
          </div>
        </div>
      )}

      {/* Popup for Membership Info */}
      {popupUserId && membershipPopup && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{ background: '#fff', padding: 24, borderRadius: 8, minWidth: 320, maxWidth: 400 }}>
            <h3>User Membership Info</h3>
            <b>UID:</b> {membershipPopup.id}<br />
            <b>Role:</b> {membershipPopup.role}<br />
            <b>Is Member:</b> {membershipPopup.is_member ? 'Yes' : 'No'}<br />
            <b>Last Payment:</b> {membershipPopup.last_payment || ''}<br />
            <b>Valid Through:</b> {membershipPopup.valid_through || ''}<br />

            <div style={{ marginTop: 16 }}>
              <b>Renew Membership:</b><br />
              <button onClick={async () => {
                const now = new Date();
                const validThrough = new Date(now);
                validThrough.setMonth(validThrough.getMonth() + 2);
                await supabase.from('user_membership').update({
                  last_payment: now.toISOString(),
                  valid_through: validThrough.toISOString(),
                  is_member: true
                }).eq('id', popupUserId);

                // Refresh popup and superuser table
                const { data } = await supabase.from('user_membership').select('*').eq('id', popupUserId).single();
                setMembershipPopup(data);
                await fetchAllMemberships();

                // Refresh own membership if updated
                if (user && popupUserId === user.id) {
                  const { data: selfMembership } = await supabase
                    .from('user_membership')
                    .select('*')
                    .eq('id', user.id)
                    .single();
                  setMembership(selfMembership);
                }
              }} style={{ marginRight: 8 }}>2 Months</button>
              <button onClick={async () => {
                const now = new Date();
                const validThrough = new Date(now);
                validThrough.setFullYear(validThrough.getFullYear() + 1);
                await supabase.from('user_membership').update({
                  last_payment: now.toISOString(),
                  valid_through: validThrough.toISOString(),
                  is_member: true
                }).eq('id', popupUserId);

                // Refresh popup and superuser table
                const { data } = await supabase.from('user_membership').select('*').eq('id', popupUserId).single();
                setMembershipPopup(data);
                await fetchAllMemberships();
              }} style={{ marginRight: 8 }}>1 Year</button>
              <button onClick={async () => {
                await supabase.from('user_membership').update({
                  valid_through: null,
                  is_member: false
                }).eq('id', popupUserId);

                // Refresh popup and superuser table
                const { data } = await supabase.from('user_membership').select('*').eq('id', popupUserId).single();
                setMembershipPopup(data);
                await fetchAllMemberships();
              }} style={{ background: 'red', color: 'white' }}>Remove Membership</button>
            </div>
            <button style={{ marginTop: 16 }} onClick={() => setPopupUserId(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}