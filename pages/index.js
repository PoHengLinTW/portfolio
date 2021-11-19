import NextLink from 'next/link'
import {
  Link,
  Container,
  Heading,
  Box,
  Image,
  // SimpleGrid,
  Button,
  List,
  ListItem,
  Icon,
  useColorModeValue
} from '@chakra-ui/react'
import { ChevronRightIcon } from '@chakra-ui/icons'
import Paragraph from '../components/paragraph'
import { BioSection, BioYear, BioTab } from '../components/bio'
import Layout from '../components/layouts/article'
import Section from '../components/section'
// import { GridItem } from '../components/grid-item'
import {
  IoLogoTwitter,
  IoLogoInstagram,
  IoLogoGithub,
  IoLogoLinkedin,
  IoMail
} from 'react-icons/io5'
// import thumbYouTube from '../public/images/links/youtube.png'
// import thumbInkdrop from '../public/images/works/inkdrop_eyecatch.png'

const Home = () => (
  <Layout>
    <Container>
      <Box
        borderRadius="lg"
        mb={6}
        p={3}
        textAlign="center"
        bg={useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')}
      >
        Greeting! I&apos;m a Computer Science graduate student at Rice University. <br/>Actively seeking for Software Engineering Internship oppotunities.
      </Box>

      <Box display={{ md: 'flex' }}>
        <Box flexGrow={1}>
          <Heading as="h2" variant="page-title">
            Po-Heng (Henry) Lin
          </Heading>
          <p>Master of Computer Science Student <br/>( Software Engineer / Fullstack Engineer )</p>
        </Box>
        <Box
          flexShrink={0}
          mt={{ base: 4, md: 0 }}
          ml={{ md: 6 }}
          textAlign="center"
        >
          <Image
            borderColor="whiteAlpha.800"
            borderWidth={2}
            borderStyle="solid"
            maxWidth="100px"
            display="inline-block"
            borderRadius="full"
            src="/images/photo.jpeg"
            alt="Profile image"
          />
        </Box>
      </Box>

      <Section delay={0.1}>
        <Heading as="h3" variant="section-title">
          Introduction
        </Heading>
        <Paragraph>
          Henry is pursuing his Master&apos; degree at Rice University. He had almost a year of experience serving as 
          software engineer and full-stack engineer at a start up company. In the work, he integrated data streaming system
          and online conference system for websites, which became the major feature and functionalities for later projects
          in the company. Meanwhile, he also had interviewed with 20+ internship candidates, and led a 5 interns team to build
          websites and content management systems. Prior to his academic study, his CS-related GPA was a solid 3.73/4 in 
          bachelor degree, showing that he had a strong computer science background. Besides, he is also skilled in C++, Java, 
          Python, and JavaScript. Currently, he is located in Houston, Texas, and seeking for software engineering internship oppotunities in summer 2022.
        </Paragraph>
        <Box align="center" my={4}>
          <NextLink href="/works">
            <Button rightIcon={<ChevronRightIcon />} colorScheme="teal">
              My portfolio
            </Button>
          </NextLink>
        </Box>
      </Section>

      <Section delay={0.2}>
        <Heading as="h3" variant="section-title">
          Biography
        </Heading>
        <BioSection>
          <BioYear>1998</BioYear>
          <BioTab/>
          Born in Kaohsiung (高雄), Taiwan (台灣).
        </BioSection>
        <BioSection>
          <BioYear>2016 - 2020</BioYear>
          Studied the Bachelor of Science in Comptuer Science with <br/>
          <BioTab/>GPA 3.76 at National Chung Cheng University (中正大學)
        </BioSection>
        <BioSection>
          <BioYear>2020 - 2021</BioYear>
          Worked at{' '}
          <Link href="http://www.patere.net" target="_blank">Patere Co.</Link>
        </BioSection>
        <BioSection>
          <BioYear>2021 - 2022</BioYear>
          Studied the Master of Computer Science at{' '}
          <Link href="https://www.rice.edu/" target="_blank">Rice University</Link>
        </BioSection>
      </Section>

      <Section delay={0.3}>
        <Heading as="h3" variant="section-title">
      Technical Skills
        </Heading>
        <BioYear>Programming Language</BioYear>
        <Paragraph>
          C/C++, Java, Python, JavaScript, TypeScript, C#, Matlab, Shell script, Golang
        </Paragraph><br/>
        <BioYear>Frameworks / Tools</BioYear>
        <Paragraph>
          VueJS, ReactJS, ReduxJS, AngularJS, NodeJS, ExpressJS, WebRTC
        </Paragraph><br/>
        <BioYear>Cloud / Infrastructure</BioYear>
        <Paragraph>
          Google Cloud Platform, AWS, Terraform, Docker, Kubernetes, Nginx
        </Paragraph><br/>
        <BioYear>Data / Database</BioYear>
        <Paragraph>
          GraphQL, InfluxDB, PostgreSQL, MongoDB, Redis, Kafka
        </Paragraph>
        
      </Section>

      <Section delay={0.3}>
        <Heading as="h3" variant="section-title">
          Hobbies
        </Heading>
        <Paragraph>
          Guitar, Workouts, Coding, PC Games, Full-Stack, Machine Learning
        </Paragraph>
      </Section>

      <Section delay={0.3}>
        <Heading as="h3" variant="section-title">
          On the web
        </Heading>
        <List>
          <ListItem>
            <Link href="https://github.com/PoHengLinTW" target="_blank">
              <Button
                variant="ghost"
                colorScheme="teal"
                leftIcon={<Icon as={IoLogoGithub} />}
              >
                @PoHengLinTW
              </Button>
            </Link>
          </ListItem>
          <ListItem>
            <Link href="https://twitter.com/pikapikachu555" target="_blank">
              <Button
                variant="ghost"
                colorScheme="teal"
                leftIcon={<Icon as={IoLogoTwitter} />}
              >
                @pikapikachu555 (Not frequently used)
              </Button>
            </Link>
          </ListItem>
          <ListItem>
            <Link href="https://www.instagram.com/henrylin_0111/" target="_blank">
              <Button
                variant="ghost"
                colorScheme="teal"
                leftIcon={<Icon as={IoLogoInstagram} />}
              >
                @henrylin_0111
              </Button>
            </Link>
          </ListItem>
          <ListItem>
            <Link href="https://www.linkedin.com/in/pohenglintw/" target="_blank">
              <Button
                variant="ghost"
                colorScheme="teal"
                leftIcon={<Icon as={IoLogoLinkedin} />}
              >
                @pohenglintw
              </Button>
            </Link>
          </ListItem>
          <ListItem>
            <Link href="mailto:poheng.henry.lin@gmail.com" target="_blank">
              <Button
                variant="ghost"
                colorScheme="teal"
                leftIcon={<Icon as={IoMail} />}
              >
                poheng.henry.lin@gmail.com
              </Button>
            </Link>
          </ListItem>
        </List>

        {/*
        <SimpleGrid columns={[1, 2, 2]} gap={6}>
          <GridItem
            href="https://www.youtube.com/devaslife"
            title="Dev as Life"
            thumbnail={thumbYouTube}
          >
            My YouTube channel
          </GridItem>
          <GridItem
            href="https://www.inkdrop.app/"
            title="Inkdrop"
            thumbnail={thumbInkdrop}
          >
            A Markdown note-taking app
          </GridItem>
        </SimpleGrid>

        <Box align="center" my={4}>
          <NextLink href="/posts">
            <Button rightIcon={<ChevronRightIcon />} colorScheme="teal">
              Popular posts
            </Button>
          </NextLink>
        </Box>
        */}
      </Section>
    </Container>
  </Layout>
)

export default Home
