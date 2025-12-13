import React from 'react';
import KebabMenuButton from './common/KebabMenuButton';
import MenuDrawer from './common/MenuDrawer';


export default function KebabMenu({ 
  onClick,
  position = 'top-right',
  style = {},
  className = '',
  size = 20,
  color = '#1565c0',
  ariaLabel = 'Open menu',
  setPage,
  openDetail,
  openSettings,
  currentTheme = {},
  primaryText = '#1565c0',
  isMenuOpen,
  setIsMenuOpen,
  minimal = false
}) {
  const handleClick = () => {
    if (setIsMenuOpen) {
      setIsMenuOpen(!isMenuOpen);
    }
    if (onClick && !isMenuOpen) {
      onClick();
    }
  };

  return (
    <>
      <KebabMenuButton
        onClick={handleClick}
        position={position}
        className={className}
        size={size}
        color={color}
        ariaLabel={ariaLabel}
        minimal={minimal}
      />
      <MenuDrawer
        isOpen={isMenuOpen}
        setIsOpen={setIsMenuOpen}
        setPage={setPage}
        openDetail={openDetail}
        openSettings={openSettings}
        primaryText={primaryText}
        currentTheme={currentTheme}
      />
    </>
  );
}


export { MenuDrawer };
