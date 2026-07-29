import HomeClient from './HomeClient';
import NvlSection from './NvlSection';

export default function Page() {
  return <HomeClient nvlSection={<NvlSection />} />;
}
