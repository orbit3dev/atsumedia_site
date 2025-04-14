import React from 'react';
import { ChevronRight } from 'lucide-react';
import MainTitle from '../../_components/MainTitle';
import { getBasePath } from '../../../_lib/config';

interface HomeMoviesProps {
	title: string;
	imageUrl?: string;
}

const HomeMovies: React.FC<HomeMoviesProps> = ({ title, imageUrl }) => {
	return (
		<div className="w-full overflow-hidden">
			<div className="mx-[10px] mb-[25px] md:mb-[50px] md:ml-[80px]">
				<MainTitle title={title} imageUrl={imageUrl} />
				<div className="flex items-center justify-start gap-2 md:ml-0 md:pr-[80px]">
					{[1, 2, 3].map((item) => (
						<div key={item}>
							<div className="relative overflow-hidden rounded-md transition-all duration-300 hover:z-10 hover:!scale-110 hover:brightness-50">
								<picture>
									<img src={getBasePath('/image/home/image-2.jpg')} alt={''} />
								</picture>
								<div className="absolute bottom-0 left-0 h-1/3 w-full bg-gradient-to-t from-black to-transparent"></div>
								<div className="absolute bottom-0 left-0 right-0 flex w-full items-center justify-between md:bottom-[30px]">
									<div className="hidden w-full flex-1 items-center justify-start px-[10px] py-[5px] text-[14px] font-bold text-white md:flex md:px-6 md:text-[21px]">
										<p className="line-clamp-1">怪物の木こり</p>
										<span className="inline-block w-4 text-left">
											<ChevronRight size={16} />
										</span>
									</div>
									<p
										className={
											'absolute bottom-[4px] right-[4px] rounded-3xl bg-gradient-to-b from-[#226DFF] to-[#D458FF] leading-none text-white md:relative md:bottom-0 md:right-6'
										}>
										<span className={'inline-block scale-50 text-[20px] md:text-[28px]'}>
											配信中
										</span>
									</p>
									{/*<p
                  className={'min-w-[56px] text-center absolute bottom-[4px] right-[4px] md:relative md:bottom-0 md:right-6 bg-black/50 text-white rounded-3xl leading-none border border-white shadow-md'}>
                  <span className={'inline-block text-[20px] md:text-[28px] scale-50'}>PR</span></p>*/}
								</div>
							</div>
							<p className="-webkit-box mt-2 line-clamp-2 text-sm md:hidden">怪物の木こり</p>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default HomeMovies;
