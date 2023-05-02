import { Flex, Spinner, Skeleton } from "@chakra-ui/react";

type SkeletonLoaderProps = {
  height: string;
  width: string;
};

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ height, width }) => {
  return (
    <Flex
      alignItems="center"
      justifyContent="center"
      position={"absolute"}
      height={height}
      width={width}
    >
      <Skeleton height="100%" width="100%" />
      <Flex
        alignItems="center"
        justifyContent="center"
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
      >
        <Spinner size="lg" zIndex={1} />
      </Flex>
    </Flex>
  );
};

export default SkeletonLoader;
