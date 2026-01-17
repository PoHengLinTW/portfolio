import NextLink from 'next/link'
import Image from 'next/image'
import { Box, Text, LinkBox } from '@chakra-ui/react'
import { Global } from '@emotion/react'

export const GridItem = ({ children, href, title, thumbnail }) => (
  <Box w="100%" textAlign="center">
    <LinkBox cursor="pointer" href={href} target="_blank">
      <Box position="relative" width="100%" aspectRatio={1} overflow="hidden">
        <Image
          src={thumbnail}
          alt={title}
          className="grid-item-thumbnail"
          loading="lazy"
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          style={{ objectFit: 'cover' }}
        />
      </Box>
      <Text mt={2}>{title}</Text>
      <Text fontSize={14}>{children}</Text>
    </LinkBox>
  </Box>
)

export const WorkGridItem = ({ children, id, title, thumbnail }) => (
  <Box w="100%" textAlign="center">
    <NextLink href={`/works/${id}`}>
      <LinkBox cursor="pointer" href={`/works/${id}`}>
        <Box position="relative" width="100%" aspectRatio={1} overflow="hidden">
          <Image
            src={thumbnail}
            alt={title}
            className="grid-item-thumbnail"
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            style={{ objectFit: 'cover' }}
          />
        </Box>
        <Text mt={2} fontSize={20}>
          {title}
        </Text>
        <Text fontSize={14}>{children}</Text>
      </LinkBox>
    </NextLink>
  </Box>
)

export const WorkGridItemExternal = ({ children, url, title, thumbnail }) => (
  <Box w="100%" textAlign="center">
    <NextLink href={url}>
      <LinkBox cursor="pointer" href={url} target="_blank">
        <Box position="relative" width="100%" aspectRatio={2} overflow="hidden">
          <Image
            src={thumbnail}
            alt={title}
            className="grid-item-thumbnail"
            loading="lazy"
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            style={{ objectFit: 'cover' }}
          />
        </Box>
          <Text mt={2} fontSize={20}>
            {title}
          </Text>
        <Text fontSize={14}>{children}</Text>
      </LinkBox>
    </NextLink>
  </Box>
)

export const GridItemStyle = () => (
  <Global
    styles={`
      .grid-item-thumbnail {
        border-radius: 12px;
      }
    `}
  />
)
