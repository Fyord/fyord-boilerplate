import { ParseJsx, Page, Route } from 'fyord';
import styles from './welcome.module.css';

/* eslint-disable max-len */
const fyordIcon = <svg viewBox="0 0 225 225" width="140" xmlns="http://www.w3.org/2000/svg"><circle cx="112.5" cy="112.5" r="110.5" fill="#0E0C2B" stroke="#DBE9EE" stroke-width="4" /><path d="M77.1016 82.5312C77.1016 83.9609 77.3242 85.4023 77.7695 86.8555C78.2148 88.2852 78.9531 89.7266 79.9844 91.1797C81.0391 92.6094 82.4102 94.0391 84.0977 95.4688C85.7852 96.8984 87.8711 98.3398 90.3555 99.793C90.3555 101.082 90.1094 102.324 89.6172 103.52C89.125 104.715 88.3867 105.758 87.4023 106.648C86.4414 107.539 85.2344 108.254 83.7812 108.793C82.3281 109.332 80.6289 109.602 78.6836 109.602C77.2305 109.602 75.7773 109.32 74.3242 108.758C72.8711 108.195 71.4766 107.398 70.1406 106.367C68.8281 105.336 67.5977 104.105 66.4492 102.676C65.3242 101.223 64.3398 99.6289 63.4961 97.8945C62.6758 96.1367 62.0195 94.25 61.5273 92.2344C61.0586 90.2188 60.8242 88.1328 60.8242 85.9766C60.8242 83.2812 61.1172 80.6445 61.7031 78.0664C62.3125 75.4883 63.2031 73.0508 64.375 70.7539C65.5703 68.4336 67.0469 66.3125 68.8047 64.3906C70.5625 62.4453 72.6016 60.7695 74.9219 59.3633C77.2656 57.9336 79.8789 56.832 82.7617 56.0586C85.6445 55.2617 88.7969 54.8633 92.2188 54.8633C93.9766 54.8633 95.6289 54.8867 97.1758 54.9336C98.7461 54.9805 100.387 55.0859 102.098 55.25C103.809 55.4141 105.684 55.6484 107.723 55.9531C109.785 56.2578 112.199 56.668 114.965 57.1836C121.012 58.2617 126.402 59.1992 131.137 59.9961C135.871 60.7695 140.113 61.4375 143.863 62C147.637 62.5625 151 63.0195 153.953 63.3711C156.906 63.7227 159.637 64.0039 162.145 64.2148C164.676 64.4258 167.066 64.5781 169.316 64.6719C171.566 64.7422 173.852 64.7891 176.172 64.8125C176.43 65.0703 176.664 65.4219 176.875 65.8672C177.086 66.2891 177.262 66.7578 177.402 67.2734C177.566 67.7891 177.684 68.3164 177.754 68.8555C177.848 69.3711 177.895 69.8516 177.895 70.2969C177.895 72.5703 177.379 74.6328 176.348 76.4844C175.34 78.3359 173.945 79.9297 172.164 81.2656C170.383 82.5781 168.309 83.5977 165.941 84.3242C163.574 85.0508 161.031 85.4141 158.312 85.4141C157.094 85.4141 155.723 85.3672 154.199 85.2734C152.699 85.1797 151.129 85.0273 149.488 84.8164C147.848 84.6055 146.172 84.3359 144.461 84.0078C142.75 83.6797 141.086 83.2812 139.469 82.8125C138.93 84.4297 138.438 86.0234 137.992 87.5938C137.57 89.1406 137.172 90.7578 136.797 92.4453C136.422 94.1094 136.047 95.8789 135.672 97.7539C135.32 99.6289 134.945 101.703 134.547 103.977C135.719 104.117 136.809 104.27 137.816 104.434C138.824 104.598 139.809 104.68 140.77 104.68C142.527 104.633 144.121 104.551 145.551 104.434C147.004 104.316 148.34 104.164 149.559 103.977C150.777 103.789 151.902 103.578 152.934 103.344C153.965 103.086 154.949 102.816 155.887 102.535C156.215 102.793 156.531 103.133 156.836 103.555C157.141 103.977 157.41 104.445 157.645 104.961C157.902 105.477 158.102 106.016 158.242 106.578C158.383 107.117 158.453 107.645 158.453 108.16C158.453 110.527 158.031 112.602 157.188 114.383C156.344 116.141 155.16 117.605 153.637 118.777C152.137 119.949 150.344 120.828 148.258 121.414C146.195 121.977 143.934 122.258 141.473 122.258C140.488 122.258 139.434 122.188 138.309 122.047C137.184 121.906 136.129 121.754 135.145 121.59C133.996 121.402 132.848 121.191 131.699 120.957C131.629 121.355 131.488 122.023 131.277 122.961C131.066 123.875 130.82 124.918 130.539 126.09C130.258 127.262 129.965 128.492 129.66 129.781C129.355 131.047 129.062 132.254 128.781 133.402C128.523 134.551 128.289 135.57 128.078 136.461C127.867 137.328 127.727 137.926 127.656 138.254C126.695 142.52 125.535 146.586 124.176 150.453C122.84 154.297 121.293 157.859 119.535 161.141C117.777 164.422 115.82 167.387 113.664 170.035C111.508 172.684 109.141 174.934 106.562 176.785C103.984 178.637 101.207 180.066 98.2305 181.074C95.2539 182.082 92.0547 182.586 88.6328 182.586C85.0234 182.586 81.8477 182.094 79.1055 181.109C76.3633 180.148 74.0664 178.777 72.2148 176.996C70.3633 175.215 68.957 173.059 67.9961 170.527C67.0586 167.996 66.5898 165.16 66.5898 162.02C66.5898 160.215 66.8125 158.363 67.2578 156.465C67.7031 154.566 68.4883 152.562 69.6133 150.453C70.7383 148.32 72.2734 146.059 74.2188 143.668C76.1875 141.277 78.6836 138.688 81.707 135.898C84.7539 133.109 88.3867 130.109 92.6055 126.898C96.8477 123.664 101.805 120.148 107.477 116.352C106.258 115.344 105.309 114.137 104.629 112.73C103.949 111.324 103.609 109.895 103.609 108.441C103.609 107.199 103.914 106.016 104.523 104.891C105.133 103.766 106.117 102.84 107.477 102.113C108.133 101.738 108.883 101.469 109.727 101.305C110.57 101.141 111.508 101.023 112.539 100.953C113.031 98.8906 113.57 96.957 114.156 95.1523C114.766 93.3477 115.445 91.5547 116.195 89.7734C116.945 87.9922 117.777 86.1875 118.691 84.3594C119.629 82.5312 120.695 80.5742 121.891 78.4883C118.07 77.2695 114.543 76.25 111.309 75.4297C108.098 74.5859 105.121 73.918 102.379 73.4258C99.6367 72.9102 97.1172 72.5469 94.8203 72.3359C92.5469 72.125 90.4375 72.0195 88.4922 72.0195C84.6016 72.0195 81.7305 72.9219 79.8789 74.7266C78.0273 76.5312 77.1016 79.1328 77.1016 82.5312ZM105.613 131.609C101.465 135.477 98.0547 138.875 95.3828 141.805C92.7109 144.734 90.5898 147.324 89.0195 149.574C87.4727 151.824 86.3945 153.793 85.7852 155.48C85.1758 157.145 84.8711 158.645 84.8711 159.98C84.8711 161.457 85 162.711 85.2578 163.742C85.5156 164.773 85.8789 165.605 86.3477 166.238C86.8164 166.871 87.3789 167.328 88.0352 167.609C88.6914 167.914 89.418 168.066 90.2148 168.066C91.5508 168.066 92.8867 167.316 94.2227 165.816C95.582 164.34 96.918 162.102 98.2305 159.102C99.543 156.078 100.82 152.281 102.062 147.711C103.305 143.141 104.488 137.773 105.613 131.609Z" fill="#DBE9EE" /></svg>;
const githubIcon = <svg class="octicon octicon-mark-github v-align-middle" width="48px" viewBox="0 0 16 16" version="1.1" aria-hidden="true" fill="black"><path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path></svg>;
/* eslint-enable max-len */

export class WelcomePage extends Page {
  Title = 'Welcome!';
  Route = async (route: Route) => route.path === document.baseURI.split(location.origin)[1];
  Template = async () => {
    return <div class={styles.welcome}>
      <header>
        <div>
          {fyordIcon}
          <h1>Welcome to Fyord</h1>
          <p>For a quick overview, visit <a href="http://fyord.dev">fyord.dev</a></p>
        </div>
      </header>

      <footer>
        <a href="https://github.com/Fyord/fyord" target="_blank" title="Fork Fyord on GitHub!">
          {githubIcon}
        </a>
      </footer>
    </div>;
  };
}
