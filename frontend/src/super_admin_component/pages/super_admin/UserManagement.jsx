// import React, { useState, useEffect, useContext } from 'react';
// import { AuthContext } from '../../../context/AuthContext'; 

// const UserManagement = () => {
//   const { token } = useContext(AuthContext);
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');

//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: '',
//     role: 'Employee',
//     profileImage: ''
//   });

//   // Fetch all users
//   const fetchUsers = async () => {
//     try {
//       const res = await fetch('http://localhost:5000/api/users', {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });

//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message);

//       setUsers(data.users);
//       setLoading(false);
//     } catch (err) {
//       setError(err.message);
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setSuccess('');

//     try {
//       const res = await fetch('http://localhost:5000/api/users/add', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify(formData)
//       });

//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message);

//       setSuccess('User added successfully!');
//       setShowAddModal(false);
//       setFormData({ name: '', email: '', password: '', role: 'Employee', profileImage: '' });
//       fetchUsers(); // Refresh list
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   const handleDelete = async (userId) => {
//     if (!window.confirm('Are you sure you want to delete this user?')) return;

//     try {
//       const res = await fetch(`http://localhost:5000/api/users/${userId}`, {
//         method: 'DELETE',
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });

//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message);

//       setSuccess('User deleted successfully!');
//       fetchUsers();
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   const getRoleBadgeColor = (role) => {
//     switch (role) {
//       case 'Super Admin': return 'bg-purple-100 text-purple-800';
//       case 'Payroll Admin': return 'bg-blue-100 text-blue-800';
//       case 'HR Admin': return 'bg-green-100 text-green-800';
//       case 'Finance': return 'bg-yellow-100 text-yellow-800';
//       case 'Employee': return 'bg-gray-100 text-gray-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   return (
//     <div className="flex"> 
//       <div className="flex-1 bg-gray-50 p-8">
//         <div className="max-w-6xl mx-auto">
//           <div className="flex justify-between items-center mb-6">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
//               <p className="text-gray-600 mt-1">Manage users in your organization</p>
//             </div>
//             <button
//               onClick={() => setShowAddModal(true)}
//               className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center space-x-2"
//             >
//               <span>➕</span>
//               <span>Add New User</span>
//             </button>
//           </div>

//           {error && (
//             <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//               {error}
//             </div>
//           )}

//           {success && (
//             <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
//               {success}
//             </div>
//           )}

//           {loading ? (
//             <div className="text-center py-12">
//               <div className="text-xl text-gray-600">Loading users...</div>
//             </div>
//           ) : (
//             <div className="bg-white rounded-xl shadow-md overflow-hidden">
//               <table className="w-full">
//                 <thead className="bg-gray-100 border-b">
//                   <tr>
//                     <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Name</th>
//                     <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
//                     <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Role</th>
//                     <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Joined</th>
//                     <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {users.map((user) => (
//                     <tr key={user._id} className="border-b hover:bg-gray-50 transition">
//                       <td className="px-6 py-4">
//                         <div className="flex items-center space-x-3">
//                           <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
//                             {user.name.charAt(0).toUpperCase()}
//                           </div>
//                           <span className="font-medium text-gray-800">{user.name}</span>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 text-gray-600">{user.email}</td>
//                       <td className="px-6 py-4">
//                         <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadgeColor(user.role)}`}>
//                           {user.role}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 text-gray-600">
//                         {new Date(user.createdAt).toLocaleDateString()}
//                       </td>
//                       <td className="px-6 py-4 text-center">
//                         {user.role !== 'Super Admin' && (
//                           <button
//                             onClick={() => handleDelete(user._id)}
//                             className="text-red-600 hover:text-red-800 font-medium"
//                           >
//                             Delete
//                           </button>
//                         )}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>

//         {/* Add User Modal */}
//         {showAddModal && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-8">
//               <h2 className="text-2xl font-bold mb-6">Add New User</h2>

//               <form onSubmit={handleSubmit} className="space-y-4">
//                 <div>
//                   <label className="block text-gray-700 font-medium mb-2">Full Name</label>
//                   <input
//                     type="text"
//                     name="name"
//                     value={formData.name}
//                     onChange={handleChange}
//                     className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     required
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-gray-700 font-medium mb-2">Email</label>
//                   <input
//                     type="email"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleChange}
//                     className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     required
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-gray-700 font-medium mb-2">Password</label>
//                   <input
//                     type="password"
//                     name="password"
//                     value={formData.password}
//                     onChange={handleChange}
//                     className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     placeholder="Min. 8 characters"
//                     required
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-gray-700 font-medium mb-2">Role</label>
//                   <select
//                     name="role"
//                     value={formData.role}
//                     onChange={handleChange}
//                     className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     required
//                   >
//                     <option value="Employee">Employee</option>
//                     <option value="Payroll Admin">Payroll Admin</option>
//                     <option value="HR Admin">HR Admin</option>
//                     <option value="Finance">Finance</option>
//                   </select>
//                 </div>

//                 <div className="flex space-x-3 pt-4">
//                   <button
//                     type="button"
//                     onClick={() => setShowAddModal(false)}
//                     className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
//                   >
//                     Add User
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default UserManagement;
