// import { Inbox } from 'lucide-react';
// import React, { useState, useEffect, useRef } from 'react';
// import { useForm } from 'react-hook-form';
// import { yupResolver } from '@hookform/resolvers/yup';
// import * as yup from 'yup';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import axiosInstance from '../../config/axios';

// const organizationSchema = yup.object().shape({
//   email: yup.string().email('Enter a valid email address'),
//   location: yup.string(),
//   mapUrl: yup.string(),
//   phone: yup.string().matches(/^\+?\d+$/, 'Invalid Phone')
// });

// const OrganizationDetails = () => {
//   const [isLoading, setIsLoading] = useState(true);
//   const [imagePreview, setImagePreview] = useState(null);
//   const [logoFile, setLogoFile] = useState(null);
//   const inputRef = useRef(null);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//   } = useForm({
//     resolver: yupResolver(organizationSchema),
//     mode: 'onChange',
//   });

//   // Fetch existing organization details
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axiosInstance.get('/company/settings');// Debug log
    
//         const organizationData = response.data.data;
      
//         reset({
//           email: organizationData.email || '',
//           location: organizationData.location || '',
//           mapUrl: organizationData.mapUrl || '',
//           phone: organizationData.phone || ''
//         });
        
//         // Set logo preview if exists
//         if (organizationData.logo) {
//           setImagePreview(organizationData.logo);
//         }
//       } catch (error) {
//         console.error('Error fetching organization details:', error);
//         toast.error('Failed to load organization details');
//       } finally {
//         setIsLoading(false);
//       }
//     };
  
//     fetchData();
//   }, []); // Keep empty dependency array

//   const handleImageUpload = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       if (file.size > 5 * 1024 * 1024) {
//         toast.error('Image size should be less than 5MB');
//         return;
//       }
//       setImagePreview(URL.createObjectURL(file));
//       setLogoFile(file);
//     }
//   };

//   const handleRemoveImage = (e) => {
//     e.stopPropagation();
//     setImagePreview(null);
//     setLogoFile(null);
//     if (inputRef.current) {
//       inputRef.current.value = '';
//     }
//   };

//   const onSubmit = async (formData) => {
//     setIsLoading(true);
//     const submitData = new FormData();
  
//     // Append all form data, including empty/null values
//     Object.entries(formData).forEach(([key, value]) => {
//       submitData.append(key, value === undefined ? '' : value); // Append empty string for undefined
//     });
  
//     // If there is a logo file, append it
//     if (logoFile) {
//       submitData.append('logo', logoFile);
//     }
  
//     const toastId = toast.loading('Saving organization details...');
  
//     try {
//       const response = await axiosInstance.post('/company/settings', submitData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });
  
//       toast.update(toastId, {
//         render: 'Organization details saved successfully',
//         type: 'success',
//         isLoading: false,
//         autoClose: 3000,
//       });
  
//       const updatedData = response.data.data;
//       reset({
//         email: updatedData.email || '',
//         location: updatedData.location || '',
//         mapUrl: updatedData.mapUrl || '',
//         phone: updatedData.phone || '',
//       });
  
//       if (updatedData.logo) {
//         setImagePreview(updatedData.logo);
//       }
//     } catch (error) {
//       console.error('Error saving organization details:', error);
//       toast.update(toastId, {
//         render: error.response?.data?.message || 'Failed to save organization details',
//         type: 'error',
//         isLoading: false,
//         autoClose: 3000,
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="p-6 bg-base-100 rounded-lg space-y-6">
//       <div className="flex items-center gap-3">
//         <Inbox className="w-6 h-6 text-primary" />
//         <h1 className="text-2xl font-bold text-neutral-content">Organization Details</h1>
//       </div>
//       <div className="bg-base-200 rounded-lg shadow">
//         <form onSubmit={handleSubmit(onSubmit)} className="p-4">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {/* Image Upload Section */}
//             <div className="form-control col-span-1 md:col-span-2 flex justify-center mb-4">
//               <label className="label">
//                 <span className="label-text">Logo</span>
//               </label>
//               <div
//                 className="border-2 w-full md:w-96 border-dashed rounded-lg p-4 flex flex-col items-center justify-center text-center cursor-pointer bg-base-100"
//                 onClick={() => inputRef.current?.click()}
//               >
//                 {!imagePreview ? (
//                   <>
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       className="h-10 w-10 text-primary mb-2"
//                       viewBox="0 0 20 20"
//                       fill="currentColor"
//                     >
//                       <path d="M4 3a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm0 2h12v3.586l-1.293-1.293a1 1 0 00-1.414 0L10 12l-2.293-2.293a1 1 0 00-1.414 0L4 12V5zm0 10v-1.586l2.293-2.293a1 1 0 011.414 0L10 13l3.293-3.293a1 1 0 011.414 0L16 12.414V15H4z" />
//                     </svg>
//                     <p className="text-neutral-content">Drag and drop or click to upload</p>
//                   </>
//                 ) : (
//                   <div className="relative">
//                     <img src={imagePreview} alt="Preview" className="w-full h-32 rounded-lg shadow-lg" />
//                     <button
//                       type="button"
//                       className="absolute top-2 right-0 btn btn-xs btn-error"
//                       onClick={handleRemoveImage}
//                     >
//                       Remove
//                     </button>
//                   </div>
//                 )}
//                 <input
//                   type="file"
//                   accept="image/*"
//                   className="hidden"
//                   ref={inputRef}
//                   onChange={handleImageUpload}
//                 />
//               </div>
//             </div>

//             {/* Other Form Fields */}
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text">Email</span>
//               </label>
//               <input
//                 type="text"
//                 placeholder="Ex: your@email.com"
//                 className={`input input-bordered ${errors.email ? 'input-error' : ''}`}
//                 {...register('email')}
//               />
//               {errors.email && <span className="text-red-500 text-sm mt-1">{errors.email.message}</span>}
//             </div>

//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text">Phone</span>
//               </label>
//               <input
//                 type="text"
//                 placeholder="Ex: 1234567890"
//                 className={`input input-bordered ${errors.phone ? 'input-error' : ''}`}
//                 {...register('phone')}
//               />
//               {errors.phone && <span className="text-red-500 text-sm mt-1">{errors.phone.message}</span>}
//             </div>

//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text">Location</span>
//               </label>
//               <input
//                 type="text"
//                 placeholder="Ex: New York, USA"
//                 className={`input input-bordered ${errors.location ? 'input-error' : ''}`}
//                 {...register('location')}
//               />
//               {errors.location && <span className="text-red-500 text-sm mt-1">{errors.location.message}</span>}
//             </div>

//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text">Map URL</span>
//               </label>
//               <input
//                 type="text"
//                 placeholder="Ex: https://maps.google.com/..."
//                 className={`input input-bordered ${errors.mapUrl ? 'input-error' : ''}`}
//                 {...register('mapUrl')}
//               />
//               {errors.mapUrl && <span className="text-red-500 text-sm mt-1">{errors.mapUrl.message}</span>}
//             </div>

            
//           </div>
//           <div className="flex justify-end mt-6">
//             <button
//               type="submit"
//               className={`btn ${isLoading ? 'btn-disabled' : 'btn-primary'} ${
//                 isLoading ? 'loading' : ''
//               }`}
//             >
//               Save
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default OrganizationDetails;


import { Inbox } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosInstance from '../../config/axios';
import playNotificationSound from '../../utils/playNotification';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { Controller } from 'react-hook-form';
import { useTheme } from '../../context/ThemeContext';

const organizationSchema = yup.object().shape({
  email: yup.string()
    .required('Email is required')
    .email('Enter a valid email address')
    .max(100, 'Email must be at most 100 characters'),
  location: yup.string()
    .required('Location is required')
    .max(200, 'Location must be at most 200 characters'),
  mapUrl: yup.string()
  .required('Map URL is required')
    .url('Enter a valid URL')
    .max(500, 'Map URL must be at most 500 characters')
    .nullable(),
  phone: yup.string()
    .required('Phone number is required')
    .matches(/^\+?[0-9]{10,14}$/, 'Phone number must be 10-14 digits')
});

const OrganizationDetails = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const inputRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm({
    resolver: yupResolver(organizationSchema),
    mode: 'onChange',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get('/company/settings');
    
        const organizationData = response.data.data;        
        reset({
          email: organizationData.email || '',
          location: organizationData.location || '',
          mapUrl: organizationData.mapUrl || '',
          phone: organizationData.phone || ''
        });
        
        if (organizationData.logo) {
          setImagePreview(organizationData.logo);
        }
      } catch (error) {
        console.error('Error fetching organization details:', error);
        toast.error('Failed to load organization details');
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchData();
  }, []); 

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      setImagePreview(URL.createObjectURL(file));
      setLogoFile(file);
    }
  };

  const handleRemoveImage = (e) => {
    e.stopPropagation();
    setImagePreview(null);
    setLogoFile(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const onSubmit = async (formData) => {
    setIsLoading(true);
    const submitData = new FormData();
  
    // Append all form data, including empty/null values
    Object.entries(formData).forEach(([key, value]) => {
      submitData.append(key, value === undefined ? '' : value);
    });
  
    // If there is a logo file, append it
    if (logoFile) {
      submitData.append('logo', logoFile);
    }
  
    const toastId = toast.loading('Saving organization details...');
  
    try {
      const response = await axiosInstance.post('/company/settings', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      playNotificationSound()
      toast.update(toastId, {
        render: 'Organization details saved successfully',
        type: 'success',
        isLoading: false,
        autoClose: 3000,
      });
  
      const updatedData = response.data.data;
      reset({
        email: updatedData.email || '',
        location: updatedData.location || '',
        mapUrl: updatedData.mapUrl || '',
        phone: updatedData.phone || '',
      });
  
      if (updatedData.logo) {
        setImagePreview(updatedData.logo);
      }
    } catch (error) {
      console.error('Error saving organization details:', error);
      toast.update(toastId, {
        render: error.response?.data?.message || 'Failed to save organization details',
        type: 'error',
        isLoading: false,
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // const FormField = ({ 
  //   label, 
  //   name, 
  //   register, 
  //   errors, 
  //   type = 'text', 
  //   placeholder,
  //   mandatory = false 
  // }) => (
  //   <div className="form-control">
  //     <label className="label">
  //       <span className="label-text">
  //         {label} 
  //         {mandatory && <span className="text-error ml-1">*</span>}
  //       </span>
  //     </label>
  //     <input
  //       type={type}
  //       placeholder={placeholder}
  //       className={`input input-bordered ${errors[name] ? 'input-error' : ''}`}
  //       {...register(name)}
  //     />
  //     {errors[name] && <span className="text-red-500 text-sm mt-1">{errors[name].message}</span>}
  //   </div>
  // );
  
  const FormField = ({ 
    label, 
    name, 
    register, 
    control,
    errors, 
    type = 'text', 
    placeholder,
    mandatory = false
  }) => {
    // Get the theme from your context
    const { theme } = useTheme();
    
    const isDarkTheme = theme === "dark";
    
    // Custom dropdown styles based on theme
    const dropdownStyles = {
      backgroundColor: isDarkTheme ? '#1a1a1a' : '#fff', // Ensures full dark theme support
      color: isDarkTheme ? '#fff' : '#000',
      border: `1px solid ${isDarkTheme ? '#444' : '#ccc'}`,
    };
    // Add hover styles for dropdown items
    const dropdownItemStyles = `
  .react-tel-input .flag-dropdown:hover, 
  .react-tel-input .country-list .country:hover,
  .react-tel-input .country-list .country.highlight { 
    background-color: ${isDarkTheme ? '#444' : '#e0e0e0'} !important; 
    color: ${isDarkTheme ? '#fff' : '#000'} !important; /* Ensure visible text color */
  }
`;

    // Custom search styles based on theme
    // const searchStyles = {
    //   backgroundColor: isDarkTheme ? '#222' : '#f5f5f5', // Dark background in dark mode
    //   color: isDarkTheme ? '#fff' : '#000',
    //   borderColor: isDarkTheme ? '#444' : '#ddd'
    // };
    
    return (
      <div className="form-control mb-4">
            <style>{dropdownItemStyles}</style>

        <label className="label">
          <span className="label-text">
            {label} 
            {mandatory && <span className="text-error ml-1">*</span>}
          </span>
        </label>
        
        {name === "phone" ? (
          <div>
            <Controller
              name={name}
              control={control}
              render={({ field }) => (
                <PhoneInput
                  country={'in'}
                  enableSearch={false}
                  disableSearchIcon={true}
                  value={field.value}
                  onChange={(phone) => field.onChange(phone)}
                  inputProps={{
                    name: field.name,
                    placeholder: placeholder || 'Enter phone number',
                    className: `input input-bordered ${errors[name] ? 'input-error' : ''}`
                  }}
                  containerStyle={{
                    width: '100%'
                  }}
                  buttonStyle={{
                    border: 'none',
                    background: 'transparent',
                    position: 'absolute',
                    left: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)'
                  }}
                  inputStyle={{
                    width: '100%',
                    height: '50px',
                    paddingLeft: '60px',
                    paddingRight: '16px',
                    borderRadius: 'var(--rounded-btn, 0.5rem)',
                    color: 'currentColor',
                    fontSize: '1rem'
                  }}
                  dropdownStyle={dropdownStyles}
                  // searchStyle={searchStyles}
                  containerClass={isDarkTheme ? 'dark-theme-phone' : 'light-theme-phone'}
                />
              )}
            />
            {errors[name] && <span className="text-red-500 text-sm mt-1">{errors[name].message}</span>}
          </div>
        ) : (
          <>
            <input
              type={type}
              placeholder={placeholder}
              className={`input input-bordered ${errors[name] ? 'input-error' : ''} h-[50px] px-4 text-base`}
              {...register(name)}
            />
            {errors[name] && <span className="text-red-500 text-sm mt-1">{errors[name].message}</span>}
          </>
        )}
      </div>
    );
  };
  return (
    <div className="p-6 bg-base-100 rounded-lg space-y-6">
      <div className="flex items-center gap-3">
        <Inbox className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-bold text-neutral-content">Organization Details</h1>
      </div>
      <div className="bg-base-200 rounded-lg shadow">
        <form onSubmit={handleSubmit(onSubmit)} className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Image Upload Section */}
            <div className="form-control col-span-1 md:col-span-2 flex justify-center mb-4">
              <label className="label">
                <span className="label-text">Logo <span> ( JPG/PNG,less than 2 MB, no high-res files.)</span></span>
                
                </label>
              <div
                className="border-2 w-full md:w-96 border-dashed rounded-lg p-4 flex flex-col items-center justify-center text-center cursor-pointer bg-base-100"
                onClick={() => inputRef.current?.click()}
              >
                {!imagePreview ? (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-10 w-10 text-primary mb-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M4 3a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm0 2h12v3.586l-1.293-1.293a1 1 0 00-1.414 0L10 12l-2.293-2.293a1 1 0 00-1.414 0L4 12V5zm0 10v-1.586l2.293-2.293a1 1 0 011.414 0L10 13l3.293-3.293a1 1 0 011.414 0L16 12.414V15H4z" />
                    </svg>
                    <p className="text-neutral-content">Drag and drop or click to upload</p>
                  </>
                ) : (
                  <div className="relative">
                    <img src={imagePreview} alt="Preview" className="w-full h-32 rounded-lg shadow-lg" />
                    <button
                      type="button"
                      className="absolute top-2 right-0 btn btn-xs btn-error"
                      onClick={handleRemoveImage}
                    >
                      Remove
                    </button>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={inputRef}
                  onChange={handleImageUpload}
                />
              </div>
            </div>

            <FormField 
              label="Email" 
              name="email" 
              register={register} 
              errors={errors} 
              placeholder="Ex: your@email.com"
              mandatory={true}
            />

            <FormField 
              label="Phone" 
              name="phone" 
              register={register} 
              control={control}
              errors={errors} 
              placeholder="Ex: 1234567890"
              mandatory={true}
            />

            <FormField 
              label="Location" 
              name="location" 
              register={register} 
              errors={errors} 
              placeholder="Ex: New York, USA"
              mandatory={true}
            />

            <FormField 
              label="Map URL" 
              name="mapUrl" 
              register={register} 
              errors={errors} 
              placeholder="Ex: https://maps.google.com/..."
              mandatory={true}

            />
          </div>
          <div className="flex justify-end mt-6">
            <button
              type="submit"
              className={`btn ${isLoading ? 'btn-disabled' : 'btn-primary'} ${
                isLoading ? 'loading' : ''
              }`}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrganizationDetails;