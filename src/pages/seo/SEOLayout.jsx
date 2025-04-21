import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import axiosInstance from '../../config/axios';
import playNotificationSound from '../../utils/playNotification';

const schema = yup.object().shape({
  title: yup.object().shape({
    default: yup.string().required('Title is required').max(160, 'Title should be max 60 characters'),
    template: yup.string()
  }),
  description: yup.string().required('Description is required').max(200, 'Description should be max 160 characters'),
  keywords: yup.string().required('Keywords are required'),
  openGraph: yup.object().shape({
    title: yup.string().required('OG title is required').max(160, 'OG title should be max 60 characters'),
    description: yup.string().required('OG description is required').max(200, 'OG description should be max 160 characters'),
    type: yup.string(),
    image: yup.string().required('OG image is required').url('Must be a valid image URL')
  }),
  twitter: yup.object().shape({
    title: yup.string().required('Twitter title is required').max(160, 'Twitter title should be max 60 characters'),
    description: yup.string().required('Twitter description is required').max(160, 'Twitter description should be max 160 characters'),
    image: yup.string().required('Twitter image is required').url('Must be a valid image URL'),
    card: yup.string()
  })
});

const SeoLayout = () => {
  const pages = ['home', 'about', 'services', 'case-studies' ,'blogs' ,'careers' ,'faqs', 'testimonials', 'contact', 'privacy-policy', 'terms'];
  const [selectedPage, setSelectedPage] = React.useState('home');
  const [isLoading, setIsLoading] = React.useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: {
        default: '',
        template: ''
      },
      description: '',
      keywords: '',
      openGraph: {
        type: 'website',
        title: '',
        description: '',
        image: ''
      },
      twitter: {
        card: 'summary_large_image',
        title: '',
        description: '',
        image: ''
      }
    }
  });

  useEffect(() => {
    const fetchSEOData = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get(`seo/get/${selectedPage}`);
        const data = response.data;

        reset({
          title: {
            default: data.title || '',
            template: ''
          },
          description: data.description || '',
          keywords: data.keywords || '',
          openGraph: {
            type: data.ogType || 'website',
            title: data.ogTitle || '',
            description: data.ogDescription || '',
            image: data.ogImage || ''
          },
          twitter: {
            card: data.twitterCard || 'summary_large_image',
            title: data.twitterTitle || '',
            description: data.twitterDescription || '',
            image: data.twitterImage || ''
          }
        });
      } catch (error) {
        reset({
          title: {
            default: null,
            template: null
          },
          description: null,
          keywords: null,
          openGraph: {
            type: null,
            title: null,
            description: null,
            image: null
          },
          twitter: {
            card: null,
            title: null,
            description: null,
            image: null
          }
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSEOData();
  }, [selectedPage, reset]);

  const onSubmit = async (data) => {
    try {
      const response = await axiosInstance.post(`seo/upsert/${selectedPage}`, {
        pageTitle: selectedPage,
        title: data.title.default,
        description: data.description,
        keywords: data.keywords,
        ogTitle: data.openGraph.title,
        ogDescription: data.openGraph.description,
        ogImage: data.openGraph.image,
        ogType: data.openGraph.type,
        twitterCard: data.twitter.card,
        twitterTitle: data.twitter.title,
        twitterDescription: data.twitter.description,
        twitterImage: data.twitter.image
      });

      if (response.status === 200) {
        playNotificationSound()
        toast.success('SEO data saved successfully');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save SEO data');
    }
  };

  const handlePageChange = (page) => {
    setSelectedPage(page);
    document.activeElement.blur();
  };

  return (
    <div className="w-full mx-auto bg-base-100 p-6 space-y-8">
      <div className="flex items-center justify-between pe-4">
        <h2 className="text-2xl font-bold text-neutral-content">SEO Editor</h2>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-neutral-content">
            Selected Page:
          </span>
          <div
            className="dropdown dropdown-end 
                 tooltip tooltip-accent 
                 text-xs 
                 font-semibold 
                 tracking-wide"
            data-tip="Select a page from the list"
          >
            <div
              tabIndex={0}
              role="button"
              className="btn btn-sm "
            >
              {selectedPage.charAt(0).toUpperCase() + selectedPage.slice(1)}
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-200 rounded-box z-[1] w-52 p-2 shadow"
            >
              {pages.map(page => (
                <li key={page}>
                  <a
                    onClick={() => handlePageChange(page)}
                    className="hover:bg-base-300"
                  >
                    {page.charAt(0).toUpperCase() + page.slice(1)}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center min-h-screen">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <section className="space-y-4 bg-base-200 p-4 rounded-lg">
            <div className="flex items-center space-x-2 relative group">
              <h3 className="text-lg font-semibold text-neutral-content cursor-pointer">
                Basic Meta Tags
              </h3>
              <span className="relative">
                <span className="w-4 h-4 bg-gray-500 text-white text-xs rounded-full flex items-center justify-center cursor-pointer">
                  ℹ️
                </span>
                <span className="absolute top-full sm:left-full sm:top-1/2 sm:-translate-y-1/2 left-1/2 -translate-x-1/2 sm:translate-x-0 mt-2 sm:mt-0 p-2 bg-gray-700 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-[90vw] sm:w-max max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg whitespace-normal break-words z-50">
                  Meta tags are HTML elements that provide information about a webpage to search engines and browsers. They help improve SEO and control how the page appears in search results.
                </span>
              </span>
            </div>


            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-neutral-content block mb-1">Title
                  <span className="text-error pl-1">*</span>
                </label>
                <input
                  {...register('title.default')}
                  className="w-full p-2 bg-base-200 border border-gray-300 rounded-md"
                  placeholder="Enter page title"
                />
                {errors.title?.default && (
                  <p className="text-red-500 text-sm mt-1">{errors.title.default.message}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-neutral-content block mb-1">Description
                  <span className="text-error pl-1">*</span>
                </label>
                <textarea
                  {...register('description')}
                  className="w-full p-2 bg-base-200 border border-gray-300 rounded-md"
                  rows={3}
                  placeholder="Enter page description"
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-neutral-content block mb-1">Keywords
                  <span className="text-error pl-1">*</span>
                </label>
                <textarea
                  {...register('keywords')}
                  className="w-full p-2 bg-base-200 border border-gray-300 rounded-md"
                  rows={3}
                  placeholder="Enter keywords (comma-separated)"
                />
                {errors.keywords && (
                  <p className="text-red-500 text-sm mt-1">{errors.keywords.message}</p>
                )}
              </div>
            </div>
          </section>

          <section className="space-y-4 bg-base-200 p-4 rounded-lg">
            <div className="flex items-center space-x-2 relative group">
              <h3 className="text-lg font-semibold text-neutral-content cursor-pointer">
                Open Graph
              </h3>
              <span className="relative">
                <span className="w-4 h-4 bg-gray-500 text-white text-xs rounded-full flex items-center justify-center cursor-pointer">
                  ℹ️
                </span>
                <span className="absolute top-full sm:left-full sm:top-1/2 sm:-translate-y-1/2 left-1/2 -translate-x-1/2 sm:translate-x-0 mt-2 sm:mt-0 p-2 bg-gray-700 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-[90vw] sm:w-max max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg whitespace-normal break-words z-50">
                  Open Graph is a protocol developed by Facebook to enhance how links appear when shared on social media. It helps control the title, image, and description in social media previews.
                </span>
              </span>
            </div>


            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-neutral-content block mb-1">OG Title
                  <span className="text-error pl-1">*</span>
                </label>
                <input
                  {...register('openGraph.title')}
                  className="w-full p-2 bg-base-200 border border-gray-300 rounded-md"
                  placeholder="Enter Open Graph title"
                />
                {errors.openGraph?.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.openGraph.title.message}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-neutral-content block mb-1">OG Description
                  <span className="text-error pl-1">*</span>
                </label>
                <textarea
                  {...register('openGraph.description')}
                  className="w-full p-2 bg-base-200 border border-gray-300 rounded-md"
                  rows={3}
                  placeholder="Enter Open Graph description"
                />
                {errors.openGraph?.description && (
                  <p className="text-red-500 text-sm mt-1">{errors.openGraph.description.message}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-neutral-content block mb-1">OG Image URL
                  <span className="text-error pl-1">*</span>
                </label>
                <input
                  {...register('openGraph.image')}
                  className="w-full p-2 bg-base-200 border border-gray-300 rounded-md"
                  placeholder="Enter Open Graph image URL"
                />
                {errors.openGraph?.image && (
                  <p className="text-red-500 text-sm mt-1">{errors.openGraph.image.message}</p>
                )}
              </div>
            </div>
          </section>

          <section className="space-y-4 bg-base-200 p-4 rounded-lg">
            <div className="flex items-center space-x-2 relative group">
              <h3 className="text-lg font-semibold text-neutral-content cursor-pointer">
                Twitter Card
              </h3>
              <span className="relative">
                <span className="w-4 h-4 bg-gray-500 text-white text-xs rounded-full flex items-center justify-center cursor-pointer">
                  ℹ️
                </span>
                <span className="absolute top-full sm:left-full sm:top-1/2 sm:-translate-y-1/2 left-1/2 -translate-x-1/2 sm:translate-x-0 mt-2 sm:mt-0 p-2 bg-gray-700 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-[90vw] sm:w-max max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg whitespace-normal break-words z-50">
                  Twitter Card tags determine how your content appears when shared on Twitter. It enhances tweets by displaying rich media like images and descriptions.
                </span>
              </span>
            </div>


            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-neutral-content block mb-1">Twitter Title <span className="text-error pl-1">*</span></label>
                <input
                  {...register('twitter.title')}
                  className="w-full p-2 bg-base-200 border border-gray-300 rounded-md"
                  placeholder="Enter Twitter title"
                />
                {errors.twitter?.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.twitter.title.message}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-neutral-content block mb-1">Twitter Description <span className="text-error pl-1">*</span></label>
                <textarea
                  {...register('twitter.description')}
                  className="w-full p-2 bg-base-200 border border-gray-300 rounded-md"
                  rows={3}
                  placeholder="Enter Twitter description"
                />
                {errors.twitter?.description && (
                  <p className="text-red-500 text-sm mt-1">{errors.twitter.description.message}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-neutral-content block mb-1">Twitter Image URL <span className="text-error pl-1">*</span></label>
                <input
                  {...register('twitter.image')}
                  className="w-full p-2 bg-base-200 border border-gray-300 rounded-md"
                  placeholder="Enter Twitter image URL"
                />
                {errors.twitter?.image && (
                  <p className="text-red-500 text-sm mt-1">{errors.twitter.image.message}</p>
                )}
              </div>
            </div>
          </section>

          <button
            type="submit"
            className="btn btn-primary"
          >
            Save SEO Settings
          </button>
        </form>
      )}
    </div>
  );
};

export default SeoLayout;