import { Box, Flex, Icon, Text, useColorModeValue } from "@chakra-ui/react"
import { Link } from "@tanstack/react-router"
import { FiAnchor , FiHome } from "react-icons/fi"


const vessels = [
  { icon: FiHome, title: "Dashboard", path: "/" },
  { icon: FiAnchor , title: "Vessels", path: "/vessels" },
]

interface SidebarVesselsProps {
  onClose?: () => void
}

const SidebarVessels = ({ onClose }: SidebarVesselsProps) => {
  const textColor = useColorModeValue("ui.main", "ui.light")
  const bgActive = useColorModeValue("#E2E8F0", "#4A5568")


  const listVessels = vessels.map(({ icon, title, path }) => (
    <Flex
      as={Link}
      to={path}
      w="100%"
      p={2}
      key={title}
      activeProps={{
        style: {
          background: bgActive,
          borderRadius: "12px",
        },
      }}
      color={textColor}
      onClick={onClose}
    >
      <Icon as={icon} alignSelf="center" />
      <Text ml={2}>{title}</Text>
    </Flex>
  ))

  return (
    <>
      <Box>{listVessels}</Box>
    </>
  )
}

export default SidebarVessels
