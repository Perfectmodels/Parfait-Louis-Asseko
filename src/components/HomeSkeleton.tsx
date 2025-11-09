import React from 'react';

const SkeletonElement: React.FC<{ className?: string }> = ({ className }) => (
    <div className={`bg-gray-700/50 animate-pulse rounded-md ${className}`} />
);

const HomeSkeleton: React.FC = () => {
    return (
        <div className="bg-pm-dark text-pm-off-white min-h-screen">
            {/* Hero Section Skeleton */}
            <section className="relative h-screen flex flex-col items-center justify-center text-center overflow-hidden">
                <div className="absolute inset-0 bg-gray-800"></div>
                <div className="relative z-10 p-6 flex flex-col items-center justify-center space-y-8 w-full max-w-4xl mx-auto">
                    <SkeletonElement className="h-24 w-3/4" />
                    <SkeletonElement className="h-6 w-full" />
                    <SkeletonElement className="h-6 w-2/3" />
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <SkeletonElement className="h-12 w-40" />
                        <SkeletonElement className="h-12 w-40" />
                    </div>
                </div>
            </section>

            <div className="page-container">
                {/* Agency Presentation Skeleton */}
                <section className="content-section">
                    <SkeletonElement className="h-12 w-1/3 mx-auto mb-8" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center mt-8">
                        <SkeletonElement className="h-80 w-full" />
                        <div className="space-y-4">
                            <SkeletonElement className="h-5 w-full" />
                            <SkeletonElement className="h-5 w-full" />
                            <SkeletonElement className="h-5 w-5/6" />
                            <SkeletonElement className="h-10 w-32 mt-4" />
                        </div>
                    </div>
                </section>

                {/* Key Figures Skeleton */}
                <section className="py-16">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <SkeletonElement className="h-28 w-full" />
                        <SkeletonElement className="h-28 w-full" />
                        <SkeletonElement className="h-28 w-full" />
                        <SkeletonElement className="h-28 w-full" />
                    </div>
                </section>

                {/* Services Skeleton */}
                <section className="content-section">
                    <SkeletonElement className="h-12 w-1/3 mx-auto mb-8" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                        <SkeletonElement className="h-60 w-full" />
                        <SkeletonElement className="h-60 w-full" />
                    </div>
                </section>
            </div>
        </div>
    );
};

export default HomeSkeleton;
