import Head from 'next/head';
import Link from 'next/link';
import Container from 'react-bootstrap/Container';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckToSlot } from '@fortawesome/free-solid-svg-icons'
import ModalOkCancel from './modalOkCancel'

const name = 'Your Name';
export const siteTitle = 'Next.js Sample Website';

export default function Layout({ children, errorMessage, setErrorMessage }) {
    return (<>
        <Head>
            <link rel="icon" href="/favicon.ico" />
            <meta
                name="description"
                content="Learn how to build a personal website using Next.js"
            />
            <meta
                property="og:image"
                content={`https://og-image.vercel.app/${encodeURI(
                    siteTitle,
                )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
            />
            <meta name="og:title" content={siteTitle} />
            <meta name="twitter:card" content="summary_large_image" />
            <title>Votejus</title>
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <header>
            <div className="navbar navbar-dark bg-dark shadow-sm mb-4">
                <div className="container">
                    <div className="navbar-brand d-flex align-items-center">
                        <span className="text-success font-weight-bold" style={{ fontSize: "150%" }}><FontAwesomeIcon icon={faCheckToSlot} /></span>&nbsp;&nbsp;
                        <strong>Votejus</strong>
                    </div>
                </div>
            </div>
        </header>

        <div className="container">
            {children}
        </div>
        <ModalOkCancel show={errorMessage} onOk={() => setErrorMessage(undefined)} onCancel={() => setErrorMessage(undefined)} title="Ocorreu um erro" text={errorMessage} />
    </>
    );
}