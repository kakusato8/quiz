import React from 'react';

interface SidebarProps {
  selectedGenre: string | null;
  onGenreSelect: (genre: string | null) => void;
  onSeriesSelect: (series: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const genres = {
  '漫画': {
    icon: '📚'
  },
  'ゲーム': {
    icon: '🎮'
  }
};

export const Sidebar: React.FC<SidebarProps> = ({
  selectedGenre,
  onGenreSelect,
  onSeriesSelect,
  isCollapsed,
  onToggleCollapse
}) => {
  console.log('🔧 Sidebar rendering with:', { selectedGenre, isCollapsed });
  const sidebarStyles = {
    sidebar: {
      position: 'fixed' as const,
      left: 0,
      top: 0,
      width: isCollapsed ? '60px' : '280px',
      height: '100vh',
      background: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)',
      borderRight: '3px solid rgba(255, 255, 255, 0.2)',
      transition: 'width 0.3s ease',
      zIndex: 1000,
      overflowY: 'auto' as const,
      boxShadow: '4px 0 20px rgba(0, 0, 0, 0.1)'
    },
    header: {
      padding: isCollapsed ? '15px 10px' : '20px 15px',
      borderBottom: '2px solid rgba(255, 255, 255, 0.1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: isCollapsed ? 'center' : 'space-between'
    },
    title: {
      color: '#ffffff',
      fontSize: isCollapsed ? '0' : '1.2em',
      fontWeight: '700',
      margin: 0,
      opacity: isCollapsed ? 0 : 1,
      transition: 'opacity 0.3s ease'
    },
    toggleButton: {
      background: 'rgba(255, 255, 255, 0.2)',
      border: 'none',
      borderRadius: '8px',
      color: '#ffffff',
      cursor: 'pointer',
      fontSize: '1.2em',
      padding: '8px',
      transition: 'background 0.3s ease'
    },
    content: {
      padding: isCollapsed ? '10px 5px' : '15px'
    },
    genreSection: {
      marginBottom: '25px'
    },
    genreHeader: {
      display: 'flex',
      alignItems: 'center',
      padding: isCollapsed ? '8px' : '12px',
      background: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '10px',
      cursor: 'pointer',
      marginBottom: '10px',
      transition: 'all 0.3s ease',
      justifyContent: isCollapsed ? 'center' : 'flex-start'
    } as React.CSSProperties,
    genreIcon: {
      fontSize: '1.4em',
      marginRight: isCollapsed ? '0' : '10px'
    },
    genreTitle: {
      color: '#ffffff',
      fontSize: isCollapsed ? '0' : '1em',
      fontWeight: '600',
      margin: 0,
      opacity: isCollapsed ? 0 : 1,
      transition: 'opacity 0.3s ease'
    },
    randomButton: {
      width: '100%',
      padding: isCollapsed ? '12px 8px' : '15px',
      background: 'linear-gradient(45deg, #ff6b9d, #c44569)',
      border: 'none',
      borderRadius: '12px',
      color: '#ffffff',
      fontSize: isCollapsed ? '1.2em' : '1em',
      fontWeight: '600',
      cursor: 'pointer',
      marginBottom: '20px',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 15px rgba(255, 107, 157, 0.3)'
    }
  };

  return (
    <div style={sidebarStyles.sidebar}>
      <div style={sidebarStyles.header}>
        {!isCollapsed && <h2 style={sidebarStyles.title}>🎯 ジャンル</h2>}
        <button 
          style={sidebarStyles.toggleButton}
          onClick={onToggleCollapse}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
          }}
        >
          {isCollapsed ? '▶' : '◀'}
        </button>
      </div>
      
      <div style={sidebarStyles.content}>
        <button 
          style={sidebarStyles.randomButton}
          onClick={() => onSeriesSelect('ランダム')}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 107, 157, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(255, 107, 157, 0.3)';
          }}
        >
          {isCollapsed ? '🎲' : '🎲 ランダム出題'}
        </button>

        {Object.entries(genres).map(([genreName, genreData]) => (
          <div key={genreName} style={sidebarStyles.genreSection}>
            <div 
              style={{
                ...sidebarStyles.genreHeader,
                background: selectedGenre === genreName ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)'
              }}
              onClick={() => onGenreSelect(selectedGenre === genreName ? null : genreName)}
              onMouseEnter={(e) => {
                if (selectedGenre !== genreName) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedGenre !== genreName) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                }
              }}
            >
              <span style={sidebarStyles.genreIcon}>{genreData.icon}</span>
              <h3 style={sidebarStyles.genreTitle}>{genreName}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};