import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { GetStaticProps, GetStaticPaths } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { api } from '../../services/api';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';
import styles from './episodes.module.scss';

type Episode = {
  id: string;
  title: string;
  thumbnail: string;
  description: string;
  members: string;
  duration: string;
  durationAsString: string;
  url: string;
  publishedAt: string;
};

type EpisodeProps = {
  episode: Episode;
}

export default function Episode({episode}: EpisodeProps) {
  const router = useRouter();
  
  return (
    <div className={styles.episode}>
      <div className={styles.thumbnailContainer}>
        <Link href="/">
          <button type="button">
            <img src="/arrow-left.svg" alt="Voltar"/>
          </button>
        </Link>
        <Image
          width={700}
          height={160}
          src={episode.thumbnail}
          objectFit="cover" />
      
      <button type="button">
          <img src="/play.svg" alt="Torcar episodio"/>
      </button>
      </div>
      <header>
        <h1>{episode.title}</h1>
        <span>{episode.members}</span>
        <span>{episode.publishedAt}</span>
        <span>{episode.durationAsString}</span>
      </header>
      <div className={styles.description} dangerouslySetInnerHTML= {{__html:episode.description}}/>
    </div>
  )
}
/*toda pagina que tem conchetes usa esse metodo*/
export const getStaticPaths: GetStaticPaths = async () => {
  return { /*aqui retornamos episodios de forma estatica*/
    paths: [], 
    fallback: 'blocking',
   }
}


export const getStaticProps: GetStaticProps = async (ctx) => {
  const { slug } = ctx.params;
  const { data } = await api.get(`/episodes/${slug}`)
  
  const episode = {
    id: data.id,
    title: data.title,
    thumbnail: data.thumbnail,
    members: data.members,
    publishedAt: format(parseISO(data.published_at), 'd mmm yy', { locale: ptBR }),
    duration: Number(data.file.duration),
    durationAsString: convertDurationToTimeString(Number(data.file.duration)),
    description: data.description,
    url: data.file.url,
  };
  
  return {
    props: {
      episode,
    },
    revalidate: 60 * 60 * 24,
  }
}
