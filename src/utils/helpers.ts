export const formatDate = (dateString: string): string => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatRuntime = (minutes: number): string => {
  if (!minutes) return 'N/A';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
};

export const formatVoteAverage = (vote: number): string => {
  return vote.toFixed(1);
};

export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

export const truncateText = (text: string, maxLength: number): string => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const getYear = (dateString: string): string => {
  if (!dateString) return 'N/A';
  return dateString.split('-')[0];
};

export const getGenreColor = (index: number): string => {
  const colors = [
    'bg-red-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-teal-500',
    'bg-orange-500',
    'bg-cyan-500',
  ];
  return colors[index % colors.length];
};

export const getRatingColor = (rating: number): string => {
  if (rating >= 7.5) return 'text-green-500';
  if (rating >= 5.5) return 'text-yellow-500';
  if (rating >= 4) return 'text-orange-500';
  return 'text-red-500';
};

export const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'released':
      return 'bg-green-500';
    case 'planned':
      return 'bg-blue-500';
    case 'in production':
      return 'bg-yellow-500';
    case 'post production':
      return 'bg-purple-500';
    case 'rumored':
      return 'bg-gray-500';
    default:
      return 'bg-gray-500';
  }
};

export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

export const sortOptions = [
  { value: 'popularity.desc', label: 'Popularity (High to Low)' },
  { value: 'popularity.asc', label: 'Popularity (Low to High)' },
  { value: 'vote_average.desc', label: 'Rating (High to Low)' },
  { value: 'vote_average.asc', label: 'Rating (Low to High)' },
  { value: 'release_date.desc', label: 'Release Date (New to Old)' },
  { value: 'release_date.asc', label: 'Release Date (Old to New)' },
  { value: 'title.asc', label: 'Title (A to Z)' },
  { value: 'title.desc', label: 'Title (Z to A)' },
];

export const sortOptionsLabels: Record<string, string> = {
  'popularity.desc': 'الأكثر شعبية',
  'popularity.asc': 'الأقل شعبية',
  'vote_average.desc': 'الأعلى تقييماً',
  'vote_average.asc': 'الأقل تقييماً',
  'release_date.desc': 'الأحدث',
  'release_date.asc': 'الأقدم',
  'title.asc': 'أ-ي',
  'title.desc': 'ي-أ',
};