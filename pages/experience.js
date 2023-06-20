import {
  Container,
  Heading,
  SimpleGrid,
  Divider,
  UnorderedList,
  ListItem
} from '@chakra-ui/react'
import Layout from '../components/layouts/article'
import Section from '../components/section'
import { WorkGridItemExternal } from '../components/grid-item'

import BBImage from '../public/images/BBIMG.jpg'
import MetaImage from '../public/images/meta.webp'
import PatereImage from '../public/images/patere.png'
import CCUImage from '../public/images/ccu.jpeg'
import Paragraph from '../components/paragraph'

const Experience = () => {
  return (
    <Layout title="Experience">
      <Container>
        <Section delay={0.2}>
          <Heading as="h3" fontSize={20} mb={4}>
            Experience
          </Heading>
          <SimpleGrid gap={6}>
            <Section delay={0.3}>
              <WorkGridItemExternal
                id="sde-bb"
                url="https://www.bloomberg.com/"
                title="Software engineer"
                thumbnail={BBImage}
              >
                Bloomberg L.P., New York City, NY, Feb 2023 - present
              </WorkGridItemExternal>
              <UnorderedList style={{ marginTop: 10 }}>
                <ListItem>
                  Built micro frontend services for more than 10 web product at Bloomberg.
                </ListItem>
                <ListItem>
                  Created a static asset/bundle host server with s3 buckets as a source for the micro frontend service
                </ListItem>
              </UnorderedList>
            </Section>
            <Divider />
            <Section delay={0.3}>
              <WorkGridItemExternal
                id="PE"
                url="https://about.facebook.com/"
                title="Production engineer intern (infra)"
                thumbnail={MetaImage}
              >
                Meta Platforms Inc. (formerly Facebook), Bellevue, WA, May 2022
                - Aug. 2022
              </WorkGridItemExternal>
              <UnorderedList style={{ marginTop: 10 }}>
                <ListItem>
                  Built capacity estimation tooling to calculate the number of
                  hosts and power needed for new users of an infra service which
                  reduced engineering time requirements for capacity
                  calculations by more than 90%
                </ListItem>
                <ListItem>
                  Created a capacity request tracking web service to record and
                  organize all capacity requests from infra customer product
                  teams with MySQL, ReactJS, and GraphQL
                </ListItem>
                <ListItem>
                  Rebuilt an old capacity query service in Hack improving query
                  speeds by more than 10%
                </ListItem>
              </UnorderedList>
            </Section>
            <Divider />
            <Section delay={0.4}>
              <WorkGridItemExternal
                id="SWE"
                title="Software engineer"
                url="https://patere.net/"
                thumbnail={PatereImage}
              >
                Patere Co. Ltd, Hsinchu, Taiwan, Jun. 2020 - Jul. 2021
              </WorkGridItemExternal>
              <UnorderedList style={{ marginTop: 10 }}>
                <ListItem>
                  Thea.ai — A online monitoring system for medical diagnosis and
                  health care
                </ListItem>
                <Paragraph>
                  Established a high-speed video data transmission platform and
                  incorporated computer vision models to assess patients’
                  recovery status and detect dangerous actions of the elderly
                  with 90% accuracy
                </Paragraph>
                <ListItem>
                  On-Time Talent Solution — A medical profession hiring web
                  application with 100,000+ global users
                </ListItem>
                <Paragraph>
                  Optimized the bottleneck of graphQL API in backend server to
                  shorten frontend query time by 20% Constructed the CI/CD
                  pipeline on GCP and containerized the code with Kubernetes to
                  replace the manual testing and deployment process, saving
                  development time for all product teams by 50%
                </Paragraph>
              </UnorderedList>
            </Section>
            <Divider />
            <Section delay={0.5}>
              <WorkGridItemExternal
                id="RS"
                title="Research student"
                thumbnail={CCUImage}
                url="https://www.cs.ccu.edu.tw/~damon/"
              >
                Innovative Computing and Visualization Lab <br />
                National Chung Chen University, Jan. 2019 - Dec. 2019
              </WorkGridItemExternal>
            </Section>
          </SimpleGrid>
        </Section>
      </Container>
    </Layout>
  )
}

export default Experience
