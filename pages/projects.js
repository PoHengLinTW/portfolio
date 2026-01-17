import { Container, Heading, SimpleGrid } from '@chakra-ui/react'
import Layout from '../components/layouts/article'
import Section from '../components/section'
import { WorkGridItem } from '../components/grid-item'

const Projects = () => {
  return (
    <Layout title="Projects">
      <Container>
        <Heading as="h3" fontSize={20} mb={4}>
          Works
        </Heading>
        <SimpleGrid columns={[1, 1, 2]} gap={6}>
          <Section>
            <WorkGridItem id="yalnix" title="Yalnix" thumbnail="/images/yalnix.png">
              A Unix-like Operating system from scratch
              <br /> Feb. 2022 - May 2022
            </WorkGridItem>
          </Section>

          <Section>
            <WorkGridItem id="mydb" title="MyDB" thumbnail="/images/mydb.png">
              A relational database implementation
              <br /> Jan. 2022 - May 2022
            </WorkGridItem>
          </Section>

          <Section>
            <WorkGridItem
              id="oneclickmeeting"
              title="OneClickMeeting (Hackathon)"
              thumbnail="/images/oneclickmeeting.png"
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
