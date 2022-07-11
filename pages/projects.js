import { Container, Heading, SimpleGrid, Divider } from '@chakra-ui/react'
import Layout from '../components/layouts/article'
import Section from '../components/section'
import { WorkGridItem } from '../components/grid-item'

import yalnixImg from '../public/images/yalnix.png'
import myDBImg from '../public/images/mydb.png'
import oneclickmeetingImg from '../public/images/oneclickmeeting.png'
import thumbWalknote from '../public/images/works/walknote_eyecatch.png'
import thumbFourPainters from '../public/images/works/the-four-painters_eyecatch.jpg'
import thumbMenkiki from '../public/images/works/menkiki_eyecatch.png'
import thumbModeTokyo from '../public/images/works/modetokyo_eyecatch.png'
import thumbStyly from '../public/images/works/styly_eyecatch.png'
import thumbPichu2 from '../public/images/works/pichu2_eyecatch.png'
import thumbFreeDBTagger from '../public/images/works/freedbtagger_eyecatch.png'
import thumbAmembo from '../public/images/works/amembo_eyecatch.png'

const Projects = () => {
  return (
    <Layout title="Projects">
      <Container>
        <Heading as="h3" fontSize={20} mb={4}>
          Works
        </Heading>
        <SimpleGrid columns={[1, 1, 2]} gap={6}>
          <Section>
            <WorkGridItem id="yalnix" title="Yalnix" thumbnail={yalnixImg}>
              A Unix-like Operating system from scratch
              <br /> Feb. 2022 - May 2022
            </WorkGridItem>
          </Section>

          <Section>
            <WorkGridItem id="mydb" title="MyDB" thumbnail={myDBImg}>
              A relational database implementation
              <br /> Jan. 2022 - May 2022
            </WorkGridItem>
          </Section>

          <Section>
            <WorkGridItem
              id="oneclickmeeting"
              title="OneClickMeeting (Hackathon)"
              thumbnail={oneclickmeetingImg}
            >
              Google Chrome extension app, Oct. 2021
            </WorkGridItem>
          </Section>
        </SimpleGrid>
      </Container>
    </Layout>
  )
}

export default Projects
