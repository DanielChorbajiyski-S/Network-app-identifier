import { 
  FaSnapchat, FaInstagram, FaFacebook, FaTiktok, FaYoutube, 
  FaLinkedin, FaPinterest, FaLocationDot, FaXTwitter, FaReddit,
  FaGoogle, FaFirefoxBrowser, FaCircleQuestion
} from 'react-icons/fa6';
import appIcons from '../../data/appIcons.json';

const iconRegistry: Record<string, React.ElementType> = {
  FaSnapchat, FaInstagram, FaFacebook, FaTiktok, FaYoutube, 
  FaLinkedin, FaPinterest, FaLocationDot, FaXTwitter, FaReddit,
  FaGoogle, FaFirefoxBrowser, FaCircleQuestion
};

export const getAppIcon = (appName: string, classNameOverride?: string) => {
  const iconProps = { className: classNameOverride || "w-5 h-5 flex-shrink-0 text-gray-700" };
  
  const matchedKey = Object.keys(appIcons).find(
    key => key.toLowerCase() === appName.trim().toLowerCase()
  ) as keyof typeof appIcons | undefined;

  const iconStringName = matchedKey ? appIcons[matchedKey] : undefined;
  const IconComponent = iconStringName ? iconRegistry[iconStringName] : FaCircleQuestion;

  return <IconComponent {...iconProps} />;
};