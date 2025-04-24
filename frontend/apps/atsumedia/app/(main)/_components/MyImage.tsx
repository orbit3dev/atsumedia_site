'use client';
import React, { FC, memo, useMemo } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
// import { S3Domain } from '@atsumedia/amplify-client';
import { cn } from '@atsumedia/shared-util';
import { Skeleton } from '@atsumedia/shared-ui/ui/lib/ui/skeleton';

type MyImageProps = {
  path: string;
  alt: string;
  height?: number;
  width?: number;
  className?: string;
  placeholder?: boolean;
  visibleByDefault?: boolean;
  isMainImage?: boolean;
};

const MyImage: FC<MyImageProps> = ({
                                     alt,
                                     path,
                                     className,
                                     placeholder = true,
                                     height,
                                     width,
                                     visibleByDefault,
                                     isMainImage = false,
                                   }) => {
  // const src = useMemo(() => `${S3Domain}/${path}`, [path]);
  const BASE_URL = process.env.NEXT_PUBLIC_ASSET_BASE_URL;
  const src = useMemo(() => `${BASE_URL}/${path}`, [path]);
  return (
    isMainImage ?
      <div
        className={cn('relative w-full overflow-hidden pt-0 md:pt-[56.5%] text-[0px] leading-none', className)}>
        <div className={'relative md:absolute bottom-0 left-0 right-0 top-0 text-center'}>
          <picture className={'inline-block overflow-hidden h-full m-auto'}>
            <LazyLoadImage
              alt={alt}
              className={'max-w-full max-h-full'}
              visibleByDefault={visibleByDefault}
              placeholder={placeholder ? <Skeleton className="h-full w-full" /> : null}
              height={height}
              width={width}
              src={src}
            />
          </picture>
        </div>
      </div> :
      <div className={cn('relative w-full overflow-hidden rounded-lg pt-[56.5%] text-[0px] leading-none', className)}>
        <div className={'absolute bottom-0 left-0 right-0 top-0'}>
          <picture>
            <LazyLoadImage
              alt={alt}
              visibleByDefault={visibleByDefault}
              placeholder={placeholder ? <Skeleton className="h-full w-full" /> : null}
              height={height}
              width={width}
              src={src}
            />
          </picture>
        </div>
      </div>
  );
};

export default memo(MyImage);
