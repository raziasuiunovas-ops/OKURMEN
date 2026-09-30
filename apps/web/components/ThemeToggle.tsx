'use client';

import { useTheme } from '@/contexts/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isChecked = theme === 'dark';

  return (
    <label className="theme-switch" aria-label="Toggle Theme">
      <input 
        type="checkbox" 
        checked={isChecked}
        onChange={toggleTheme}
        aria-label={theme === 'light' ? 'Караңгы тема' : 'Жарык тема'}
      />
      <div className="switch-bg">
        <div className="sky-stars">
          <div className="star star-1"></div>
          <div className="star star-2"></div>
          <div className="star star-3"></div>
          <div className="star star-4"></div>
        </div>

        <div className="sky-clouds">
          <div className="cloud cloud-1"></div>
          <div className="cloud cloud-2"></div>
        </div>

        <div className="sky-vault">
          <div className="sun"></div>
          <div className="moon">
            <div className="craters">
              <div className="crater crater-1"></div>
              <div className="crater crater-2"></div>
              <div className="crater crater-3"></div>
            </div>
          </div>
        </div>

        <div className="landscape">
          <div className="mountain mountain-1"></div>
          <div className="mountain mountain-2"></div>
          <div className="terrain"></div>
          <div className="tree tree-1"></div>
          <div className="tree tree-2"></div>
          <div className="tree tree-3"></div>
        </div>
      </div>

      <style jsx>{`
        .theme-switch {
          position: relative;
          display: inline-block;
          width: 48px;
          height: 48px;
          cursor: pointer;
          border-radius: 50%;
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.15));
          -webkit-tap-highlight-color: transparent;
          flex-shrink: 0;
        }

        .theme-switch input {
          opacity: 0;
          width: 0;
          height: 0;
          position: absolute;
        }

        .switch-bg {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border-radius: 50%;
          overflow: hidden;
          border: 2px solid #ffffff;
          box-shadow: inset 0 3px 6px rgba(0, 0, 0, 0.3);
          background: linear-gradient(180deg, #5ab5e6 0%, #aee0ff 100%);
          z-index: 1;
          transition: border-color 0.8s ease;
        }

        .switch-bg::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, #0b1325 0%, #1a2845 100%);
          opacity: 0;
          transition: opacity 0.8s ease;
          z-index: -1;
        }

        .sky-vault {
          position: absolute;
          width: 100%;
          height: 200%;
          top: 0;
          left: 0;
          transform-origin: 50% 50%;
          transition: transform 0.9s cubic-bezier(0.5, 0.1, 0.3, 1.2);
          z-index: 2;
        }

        .sun,
        .moon {
          position: absolute;
          width: 15px;
          height: 15px;
          left: calc(50% - 7.5px);
          border-radius: 50%;
        }

        .sun {
          top: 6px;
          background: linear-gradient(145deg, #fffcf0, #ffd300);
          box-shadow: 0 0 8px rgba(255, 211, 0, 0.6),
            inset -1px -1px 3px rgba(0, 0, 0, 0.1);
        }

        .moon {
          bottom: 6px;
          background: linear-gradient(145deg, #e2e2e5, #8a8e94);
          box-shadow: 0 0 8px rgba(255, 255, 255, 0.4),
            inset -1px -1px 3px rgba(0, 0, 0, 0.3);
          transform: rotate(180deg);
        }

        .craters {
          position: absolute;
          width: 100%;
          height: 100%;
        }

        .crater {
          position: absolute;
          background: #7a7e85;
          border-radius: 50%;
          box-shadow: inset 1px 1px 2px rgba(0, 0, 0, 0.4),
            inset -1px -1px 2px rgba(255, 255, 255, 0.8);
        }

        .crater-1 {
          width: 4px;
          height: 4px;
          top: 3px;
          left: 3px;
        }

        .crater-2 {
          width: 2.5px;
          height: 2.5px;
          top: 8px;
          left: 2.5px;
        }

        .crater-3 {
          width: 3px;
          height: 3px;
          top: 8px;
          left: 8px;
        }

        .sky-clouds {
          position: absolute;
          width: 100%;
          height: 100%;
          transition: 0.8s ease;
          opacity: 1;
          z-index: 1;
        }

        .cloud {
          position: absolute;
          background: white;
          border-radius: 20px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .cloud-1 {
          width: 17px;
          height: 6px;
          top: 17px;
          left: -4px;
        }

        .cloud-1::before {
          content: "";
          position: absolute;
          width: 8px;
          height: 8px;
          background: white;
          border-radius: 50%;
          top: -4px;
          left: 4px;
        }

        .cloud-2 {
          width: 14px;
          height: 5px;
          top: 27px;
          right: -3px;
        }

        .cloud-2::before {
          content: "";
          position: absolute;
          width: 7px;
          height: 7px;
          background: white;
          border-radius: 50%;
          top: -3px;
          left: 3px;
        }

        .sky-stars {
          position: absolute;
          width: 100%;
          height: 100%;
          transition: 0.8s ease;
          opacity: 0;
          transform: translateY(-15px);
          z-index: 1;
        }

        .star {
          position: absolute;
          background: white;
          border-radius: 50%;
          box-shadow: 0 0 3px white;
        }

        .star-1 {
          width: 1px;
          height: 1px;
          top: 10px;
          left: 10px;
        }

        .star-2 {
          width: 1.5px;
          height: 1.5px;
          top: 15px;
          left: 32px;
        }

        .star-3 {
          width: 1px;
          height: 1px;
          top: 24px;
          left: 12px;
        }

        .star-4 {
          width: 0.8px;
          height: 0.8px;
          top: 10px;
          left: 24px;
        }

        .landscape {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 50%;
          z-index: 3;
          pointer-events: none;
        }

        .mountain {
          position: absolute;
          bottom: 6px;
          width: 0;
          height: 0;
          border-left: 13px solid transparent;
          border-right: 13px solid transparent;
          transition: border-bottom-color 0.8s ease;
        }

        .mountain-1 {
          left: -4px;
          border-bottom: 22px solid #4ca382;
        }

        .mountain-2 {
          right: -4px;
          border-bottom: 17px solid #65b899;
        }

        .terrain {
          position: absolute;
          bottom: -11px;
          left: -8px;
          width: 64px;
          height: 22px;
          background: #348e6a;
          border-radius: 50%;
          transition: background 0.8s ease;
        }

        .tree {
          position: absolute;
          width: 10px;
          height: 14px;
          filter: drop-shadow(0.5px 1px 0.5px rgba(0, 0, 0, 0.25));
          z-index: 4;
        }

        .tree::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 85%;
          background: linear-gradient(
            90deg,
            #3aa673 0%,
            #236b47 50%,
            #15452d 100%
          );
          clip-path: polygon(
            50% 0%,
            80% 35%,
            60% 35%,
            90% 70%,
            65% 70%,
            100% 100%,
            0% 100%,
            35% 70%,
            10% 70%,
            40% 35%,
            20% 35%
          );
          transition: background 0.8s ease;
        }

        .tree::after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 40%;
          width: 20%;
          height: 15%;
          background: linear-gradient(90deg, #704629 0%, #4a2d1a 100%);
          transition: background 0.8s ease;
          border-radius: 1px;
        }

        .tree-1 {
          left: 7px;
          bottom: 6px;
          transform: scale(0.85);
        }

        .tree-2 {
          right: 10px;
          bottom: 7px;
          transform: scale(1.05);
        }

        .tree-3 {
          left: 17px;
          bottom: 4px;
          transform: scale(0.65);
          z-index: 5;
        }

        .tree-3::before {
          background: linear-gradient(
            90deg,
            #2d8a5c 0%,
            #1a5436 50%,
            #0f3621 100%
          );
        }

        .theme-switch input:checked + .switch-bg {
          border-color: #2a3b5c;
        }

        .theme-switch input:checked + .switch-bg::before {
          opacity: 1;
        }

        .theme-switch input:checked + .switch-bg .sky-vault {
          transform: rotate(180deg);
        }

        .theme-switch input:checked + .switch-bg .sky-clouds {
          opacity: 0;
          transform: translateY(15px);
        }

        .theme-switch input:checked + .switch-bg .sky-stars {
          opacity: 1;
          transform: translateY(0);
        }

        .theme-switch input:checked + .switch-bg .landscape .mountain-1 {
          border-bottom-color: #162238;
        }

        .theme-switch input:checked + .switch-bg .landscape .mountain-2 {
          border-bottom-color: #1e2c45;
        }

        .theme-switch input:checked + .switch-bg .landscape .terrain {
          background: #0d1526;
        }

        .theme-switch input:checked + .switch-bg .landscape .tree::before {
          background: linear-gradient(
            90deg,
            #1a283b 0%,
            #101a29 50%,
            #070c14 100%
          );
        }

        .theme-switch input:checked + .switch-bg .landscape .tree-3::before {
          background: linear-gradient(
            90deg,
            #131e2e 0%,
            #0b121f 50%,
            #05080f 100%
          );
        }

        .theme-switch input:checked + .switch-bg .landscape .tree::after {
          background: linear-gradient(90deg, #111a26 0%, #080d14 100%);
        }

        /* Responsive adjustments */
        @media (max-width: 1024px) {
          .theme-switch {
            width: 44px;
            height: 44px;
          }

          .sun,
          .moon {
            width: 14px;
            height: 14px;
            left: calc(50% - 7px);
          }

          .sun {
            top: 5px;
          }

          .moon {
            bottom: 5px;
          }
        }

        @media (max-width: 768px) {
          .theme-switch {
            width: 40px;
            height: 40px;
          }

          .switch-bg {
            border: 2px solid #ffffff;
          }

          .sun,
          .moon {
            width: 12px;
            height: 12px;
            left: calc(50% - 6px);
          }

          .sun {
            top: 5px;
          }

          .moon {
            bottom: 5px;
          }

          .crater-1 {
            width: 3px;
            height: 3px;
            top: 2px;
            left: 2px;
          }

          .crater-2 {
            width: 2px;
            height: 2px;
            top: 6px;
            left: 2px;
          }

          .crater-3 {
            width: 2px;
            height: 2px;
            top: 6px;
            left: 7px;
          }

          .cloud-1 {
            width: 13px;
            height: 5px;
            top: 13px;
            left: -3px;
          }

          .cloud-1::before {
            width: 6px;
            height: 6px;
            top: -3px;
            left: 3px;
          }

          .cloud-2 {
            width: 11px;
            height: 4px;
            top: 21px;
            right: -2px;
          }

          .cloud-2::before {
            width: 5px;
            height: 5px;
            top: -2px;
            left: 3px;
          }

          .star-1 {
            top: 8px;
            left: 8px;
          }

          .star-2 {
            width: 1px;
            height: 1px;
            top: 12px;
            left: 24px;
          }

          .star-3 {
            top: 18px;
            left: 9px;
          }

          .star-4 {
            width: 0.5px;
            height: 0.5px;
            top: 8px;
            left: 19px;
          }

          .mountain {
            bottom: 5px;
            border-left: 10px solid transparent;
            border-right: 10px solid transparent;
          }

          .mountain-1 {
            left: -3px;
            border-bottom: 17px solid #4ca382;
          }

          .mountain-2 {
            right: -3px;
            border-bottom: 13px solid #65b899;
          }

          .terrain {
            bottom: -8px;
            left: -5px;
            width: 50px;
            height: 16px;
          }

          .tree {
            width: 8px;
            height: 11px;
          }

          .tree-1 {
            left: 5px;
            bottom: 5px;
            transform: scale(0.75);
          }

          .tree-2 {
            right: 8px;
            bottom: 6px;
            transform: scale(0.9);
          }

          .tree-3 {
            left: 13px;
            bottom: 3px;
            transform: scale(0.55);
          }
        }
      `}</style>
    </label>
  );
}
